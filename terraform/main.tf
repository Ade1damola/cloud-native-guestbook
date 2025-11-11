# Setup the Remote State Backend (MANDATORY)
terraform {
  required_providers {
    aws = {
        source = "hashicorp/aws"
        version = "~> 5.0"
    }
  }

  backend "s3" {
    # Create S3 bucket manually in AWS first
    bucket = "my-terraform-remote-state-bucket"
    key    = "capstone-project/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
    }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# VPC and Networking Resources
resource "aws_vpc" "main" {
  cidr_block = "var.vpc_cidr"
  enable_dns_hostnames = true
    tags = {
        Name = "${var.project_name}-vpc"
    }
}

resource "aws_internet_gateway" "gw" {
    vpc_id = aws_vpc.main.id
        tags = {
            Name = "${var.project_name}-igw"
        }  
}

# Public Subnet
resource "aws_subnet" "public" {
    vpc_id            = aws_vpc.main.id
    cidr_block        = "var.public_subnet_cidr"
    map_public_ip_on_launch = true
    tags = {
        Name = "${var.project_name}-public-subnet"
    }
}

# Private Subnet
resource "aws_subnet" "private" {
    vpc_id            = aws_vpc.main.id
    cidr_block        = "var.private_subnet_cidr"
    tags = {
        Name = "${var.project_name}-private-subnet"
    }
}

# Route Table for Public Subnet
resource "aws_route_table" "public" {
    vpc_id = aws_vpc.main.id
    tags = {
        Name = "${var.project_name}-public-rt"
    }
}

resource "aws_route" "public_internet_access" {
    route_table_id         = aws_route_table.public.id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id             = aws_internet_gateway.gw.id
}

resource "aws_route_table_association" "public_assoc" {
    subnet_id      = aws_subnet.public.id
    route_table_id = aws_route_table.public.id
}

# Security Group allowing inbound HTTP and SSH traffic
resource "aws_security_group" "app_sg" {
  name        = "${var.project_name}-app-sg"
  description = "Allow HTTP and SSH inbound traffic"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }    
  
  tags = {
    Name = "${var.project_name}-app-sg"
  }

}

# Security Group for DB allowing inbound traffic from the app
resource "aws_security_group_rule" "allow_app_to_db" {
  type              = "ingress"
  from_port         = 5432 
  to_port           = 5432
  protocol          = "tcp"
  source_security_group_id = aws_security_group.app_sg.id 
  security_group_id = aws_security_group.db_sg.id
}


resource "aws_db_subnet_group" "default" {
  subnet_ids = [aws_subnet.private.id] 
  tags = { Name = "${var.project_name}-security-group" }
}

# The actual Managed Database (RDS)
resource "aws_db_instance" "app_db" {
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "15.5"
  instance_class         = "db.t3.micro" 
  username               = "masteruser"
  password               = var.db_password 
  vpc_security_group_ids = [aws_security_group.db_sg.id] 
  publicly_accessible    = false 
  db_subnet_group_name   = aws_db_subnet_group.default.name
  skip_final_snapshot    = true
}