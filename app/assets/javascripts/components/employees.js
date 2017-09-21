riot.tag2('employee-item', '<td> <virtual if="{editMode}"> <input type="text" ref="editName" riot-value="{currentEmployee.name}"><br> <span style="color:red">{errors.name}</span> </virtual> <virtual if="{!editMode}"> {currentEmployee.name} </virtual> </td> <td> <virtual if="{editMode}"> <input type="text" ref="editEmail" riot-value="{currentEmployee.email}"><br> <span style="color:red">{errors.email}</span> </virtual> <virtual if="{!editMode}"> {currentEmployee.email} </virtual> </td> <td> <virtual if="{editMode}"> <input type="checkbox" ref="editManager" checked="{currentEmployee.manager}"> </virtual> <virtual if="{!editMode}"> {currentEmployee.manager ? \'&#10004\' : \'\'} </virtual> </td> <td> <button if="{!editMode}" onclick="{editEmployee}">Edit</button> <button if="{!editMode}" onclick="{fireEmployee}">Fire</button> <button if="{editMode}" onclick="{updateEmployee}">Update</button> <button if="{editMode}" onclick="{cancleUpdate}"">Cancle</button> </td>', '', '', function(opts) {
  this.currentEmployee = this.row
  this.errors = {}
  this.editMode = false

  this.on('mount', function(){
    console.log('mounting employee items')
  })

  this.on('update', function(){
    console.log('Current employee item updated.')
  })

  this.editEmployee = function(e) {
    this.editMode = !this.editMode
    this.update()
  }.bind(this)

  this.updateEmployee = function(e) {
    var that = this
    if (that.currentEmployee.name !== that.refs.editName.value || that.currentEmployee.email !== that.refs.editEmail.value || that.currentEmployee.manager !== that.refs.editManager.checked) {
      that.currentEmployee.name = that.refs.editName.value
      that.currentEmployee.email = that.refs.editEmail.value
      that.currentEmployee.manager = that.refs.editManager.checked
      $.ajax({
        method: 'PUT',
        data: {
          employee: that.currentEmployee
        },
        url: '/employees/'+that.currentEmployee.id+'.json',
        success: function(res) {
          that.errors = {}
          that.currentEmployee = res
          that.editMode = false
          that.update()
        },
        error: function(res) {
          that.errors = res.responseJSON.errors
        }
      })
    } else {
      alert('No change happened.')
    }

  }.bind(this)

  this.toggleManagerStatus = function(e) {

  }.bind(this)

  this.fireEmployee = function(e) {
    console.log('Fire employee item'+this.i)
    var that = this
    $.ajax({
      method: 'DELETE',
      url: '/employees/'+that.currentEmployee.id+'.json',
      success: function(res) {
        that.parent.employees.splice(that.i, 1)
        that.parent.update()
      }
    })
  }.bind(this)

  this.cancleUpdate = function(e) {
    this.editMode = !this.editMode
    this.update()
  }.bind(this)
});

riot.tag2('employees', '<table> <thead> <tr> <th>Name</th> <th>Email</th> <th>Manager</th> <th></th> </tr> </thead> <tbody> <tr> <td> <input type="text" ref="emplyee_name" oninput="{editName}"><br> <span>{errors.name}</spen> </td> <td> <input type="text" ref="employee_email" oninput="{editEmail}"><br> <span>{errors.email}</span> </td> <td> <input type="checkbox" ref="employee_manager" onclick="{editManager}"><br> </td> <td> <button disabled="{!validation.name||!validation.email}" onclick="{hireEmployee}">Hire</button> </td> </tr> <tr data-is="employee-item" each="{row, i in employees}" data="{row, i}"></tr> </tbody> </table>', '', '', function(opts) {
  var emailREG = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  this.employees = []
  this.employee = {
    name: '',
    email: '',
    manager: false
  }
  this.errors = {}
  this.validation = {name: true, email: true}

  this.on('mount', function(){
    var that=this
    $.ajax({
      url: '/employees.json',
      success: function(res) {
        that.employees = res
        that.update()
      }
    })
  })

  this.editName = function(e) {
    this.validation.name = !!e.target.value
    this.employee.name = e.target.value
  }.bind(this)

  this.editEmail = function(e) {
    this.validation.email = emailREG.test(e.target.value)
    this.employee.email = e.target.value
  }.bind(this)

  this.editManager = function(e) {
    this.employee.manager = !this.employee.manager
  }.bind(this)

  this.hireEmployee = function(e) {
    var that=this;
    $.ajax({
      method: 'POST',
      data: {
        employee: that.employee
      },
      url: '/employees.json',
      success: function(res) {
        that.errors = {}
        that.employees.push(res)
        that.employee = {
          name: '',
          email: '',
          manager: false
        }
        that.refs.emplyee_name.value = ''
        that.refs.employee_email.value = ''
        that.refs.employee_manager.checked = false
        that.update()
      },
      error: function(res) {
        that.errors = res.responseJSON.errors
      }
    })
  }
});