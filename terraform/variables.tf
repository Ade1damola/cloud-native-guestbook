# The region where all your AWS resources will be created.
variable "aws_region" {
  description = "The AWS region to deploy resources into."
  type        = string
  default     = "eu-north-1"
}

# The name used as a prefix for all resources (VPC, DB, LB, etc.).
variable "project_name" {
  description = "A name prefix for all resources."
  type        = string
  default     = "capstone-cloud-app"
}

# The main block of IP addresses for your custom VPC.
variable "vpc_cidr" {
  description = "The CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16" # A large, private IP range
}

# The root password for your managed database (RDS). 
variable "db_password" {
  description = "The password for the RDS database."
  type        = string
  sensitive   = true # Terraform knows this is a secret
  default     = "MySuperSecretPassword123" 
}

variable "public_subnet_cidr" {
  description = "The CIDR block for the Public Subnet"
  type = string
  default = "10.0.1.0/24"
}


variable "private_subnet_cidr" {
  description = "The CIDR block for the Private Subnet"
  type = string
  default = "10.0.2.0/24"
}