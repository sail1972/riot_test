class Employee < ActiveRecord::Base
  attr_accessible :name, :email, :manager
end
