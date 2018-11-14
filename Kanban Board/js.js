// Set database
var DB = {
  get_data: function() {
    if (typeof (Storage) !== undefined) {
      var data;
      try {
        data = JSON.parse(localStorage.getItem('list')) || {};
      } catch (error) {
        data = {};
      }
      return data;
    } else {
      alert('Sorry. No Web storage support.');
      return {};
    }
  },
  set_data: function(data) {
    localStorage.setItem('list', JSON.stringify(data));
  }
}

// Set lists
var list = DB.get_data();
if (Object.keys(list).length === 0 && list.constructor === Object) {
  var newList = {
    'todo': [],
    'doing': [],
    'done': []
  };
  DB.set_data(newList);
  list = DB.get_data();
} 

// Update lists
function updateTask(list) {
  var newList = {
    'todo': [],
    'doing': [],
    'done': []
  };
  var taskType = ['todo','doing','done'];
  taskType.forEach(function(type) {
    var newListType = newList[type];
    var inputArr = $('.' + type).find('.item__text');
    inputArr.each(function() {
      newListType.push($(this).attr('value'));
    });
  });
  list = newList;
  return list;
  console.log('update');
}

// Make sure add button always is the last
function check_add_last(list) {
  if(list.children('.list__add').is(":last-child")) {
    return;
  } else {
    list.children().last().insertBefore(list.children('.list__add'));
  }
}

// Show, hide edit/delete button
function show_hide_btn() {
  $('.list__item').find('.item__btn').css('visibility','hidden');
  $('.list__item').hover(function() {
    $(this).find('.item__btn').css('visibility','visible');
  }, function() {
    $(this).find('.item__btn').css('visibility','hidden');
  });
}

// Add color to list
function color_list() {
  $('.todo').children().css("background-color", "#ffdddd");
  $('.doing').children().css("background-color", "#DDFFDD");
  $('.done').children().css("background-color", "#DDFFFF");
}

// Calculate list item 
function count_list_item() {
  let todo = $('.todo').children().length - 2;
  $('.todo > .list__head').text('TO DO (' + todo + ')');
  let doing = $('.doing').children().length - 2;
  $('.doing > .list__head').text('DOING (' + doing + ')');
  let done = $('.done').children().length - 2;
  $('.done > .list__head').text('DONE (' + done + ')'); 
}

// Delete click 
function delete_click() {
  $('.btn__delete').click(function(){
    delete_task(this);
  });
}

// Delete task
function delete_task(btn) {
  $('#myModal').modal('show');
  $('.no-delete').click(function(){
    $('#myModal').modal('hide');
  });
  $('.delete').off().click(function(){
    $(btn).parent().parent().remove();
    count_list_item();
    prepare_board();
    list = updateTask(list);
    DB.set_data(list);
  });
}

// Edit click
function edit_click() {
  $('.btn__edit').off().click(function() {
    edit_task(this);
  });
}

// Edit task
function edit_task(btn) {
  var $input = $(btn).parent().prev();
  var task = $input.val();
  $input.val('').focus();
  $input.keydown(function(e) {
    var event = window.event || e;
    if ((event.keyCode === 13) && ($input.val() !== '')) {
      $input.attr('placeholder',$input.val());
      $input.attr('value', $input.val());
      task = $input.val();
      $input.blur();
      list = updateTask(list);
      DB.set_data(list);
    } else if ((event.keyCode === 13) && ($input.val() === '')) {
      console.log('task 2 is' + task);
      $input.attr('placeholder', task);
      $input.attr('value', task);
      $input.val(task);
      $input.blur();
    }        
  })
}

// Prepare board 
function prepare_board() {
  color_list();
  count_list_item();
  show_hide_btn();
  delete_click();
  edit_click();
}

// Create new task
function new_task(e, type, input) {
  var $input = $(input);
  var new_task = $input.val(); 
  var event = window.event || e;
  if ((event.keyCode === 13) && (new_task.trim() !== '')) {
    this.add_new_task(type, new_task, $input); 
    }    
  }

// Add new task
function add_new_task(type, new_task, input) {
  var new_task_div = '<div class="list__item"><input type="text" class="item__text" value="' + new_task + '" placeholder="' + new_task +'"></input><div class="item__btn"><button class="btn__edit" title="Chỉnh sửa công việc"><i class="fa fa-edit"></i></button><button class="btn__delete" title="Xoá công việc"><i class="fa fa-trash"></i></button></div></div>';
  $(new_task_div).insertBefore($('.' + type).children('.list__add'));
  $(input).val('').blur();
  prepare_board();
  list = updateTask(list);
  DB.set_data(list);
}

// First configuration
$(window).on('load', function() {
  var task_type = ['todo', 'doing', 'done'];
  task_type.forEach(function(type) {
    var taskType = list[type];
    taskType.forEach(function(task) {
      var new_task_div = '<div class="list__item"><input type="text" class="item__text" value="' + task + '" placeholder="' + task +'"></input><div class="item__btn"><button class="btn__edit" title="Chỉnh sửa công việc"><i class="fa fa-edit"></i></button><button class="btn__delete" title="Xoá công việc"><i class="fa fa-trash"></i></button></div></div>';
      $(new_task_div).insertBefore($('.' + type).children('.list__add'));
      $('.' + type).children('.list__add').val('').blur();
    })
  });
  prepare_board();

  // Dragable list item
  $(function() {
    $( ".list" ).sortable({
      placeholder: 'placeholder',
      connectWith: ".list",
      items: "div:not(.list__head,.list__add,.item__btn)",
      cancel: null,
      update: function() {
        color_list();
        check_add_last($(this));
        count_list_item();
        list = updateTask(list);
        DB.set_data(list);
      }
    });
  });
});