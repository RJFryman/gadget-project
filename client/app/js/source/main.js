(function(){

  'use strict';

  $(document).ready(initialize);

  var users = [];
  var gadgets=[];

  function initialize(){
    $(document).foundation();
    $('#toggle-user').click(toggleUser);
    $('#toggle-gadget').click(toggleGadget);
    $('#saveUser').click(saveUser);
    $('#saveGadget').click(saveGadget);
    $('#users').on('click', '.picture', populateUser);
    $('#gadgets').on('click', '.picture', populateGadget);
    $('#gadgets').on('click', '.purchase', populateGadget);
    $('#gadgets').on('click', '.purchase', togglePurchase);
    $('#updateUser').click(updateUser);
    $('#updateGadget').click(updateGadget);
    $('#removeUser').click(deleteUser);
    $('#removeGadget').click(deleteGadget);
    $('#purchaseGadget').click(commitPurchase);
    getUsers();
    getGadgets();
  }
  function commitPurchase(){
    alert('almost there');

    var cost = $('input[name="cost"]').val()*1;
    var itemName = $('input[name="name"]').val();
    var amount = $('#totalDropdown').val()*1;
    var totalCost = cost * amount;

    var username = $('#userDropdown').val();
    var userRow = $('#users .name:contains('+username+')');
    var startingBalance = userRow.siblings('.balance').text() * 1;
    var previousPurchases = userRow.siblings('.purchase').text();
    var userId = userRow.siblings('.picture').attr('data-user-id');
    var userpic = userRow.siblings('.picture').css('background-image');
    var userpicf = userpic.replace('url(','').replace(')','');
    var available = $('input[name="amount"]').val()*1;


    if (startingBalance > totalCost){
      var newAvailable = available-amount;
      $('input[name="amount"]').val(newAvailable);
      updateGadget();

      var newBalance = startingBalance - totalCost;
      $('input[name="_id"]').val(userId);
      $('input[name="name"]').val(username);
      $('input[name="balance"]').val(newBalance);
      $('input[name="picture"]').val(userpicf);
      var newpurchase = amount + ' : ' + itemName;

      $('input[name="purchases"]').val(newpurchase+', ' + previousPurchases);

      updateUser();
      $('#purchase').toggleClass('hidePurchase');
    }
    event.preventDefault();
  }

// Toggle Buttons
  function toggleUser(){
    $('#user').toggleClass('hideUser');
  }

  function toggleGadget(){
    $('#gadget').toggleClass('hideGadget');
  }

  function togglePurchase(){
    $('#purchase').toggleClass('hidePurchase');
    toggleGadget();
    updateDrops();
  }

  function updateDrops(){
    var userDropDown = $('#userDropdown');
    var totalDropDown = $('#totalDropdown');

    userDropDown.empty();
    totalDropDown.empty();

    $('#users .name').each(function(){
      var text = $(this).text();
      var $option1 = $('<option>');
      $option1.text(text);
      userDropDown.append($option1);
    });
    var num;
    num =$('input[name="amount"]').val()*1;
    var range = _.range(num + 1);

    for (var i = 0; i < range.length; i++){
      var $option2 = $('<option>');
      $option2.text(i);
      totalDropDown.append($option2);
    }
  }


// User
// Save User
  function saveUser(){
    var data = $('#user').serialize();
    var url = window.location.origin.replace(/\d{4}/,'4000')+'/users';
    var type = 'POST';
    console.log(data);
    var success = newUser;

    $.ajax({url:url, type:type, data:data, success:success});
    event.preventDefault();
  }

  function saveGadget(){
    var data = $('#gadget').serialize();
    var url = window.location.origin.replace(/\d{4}/,'4000')+'/gadgets';
    var type = 'POST';
    console.log(data);
    var success = newGadget;

    $.ajax({url:url, type:type, data:data, success:success});
    event.preventDefault();
  }

  function getUsers(){
    var url = window.location.origin.replace(/\d{4}/,'4000')+'/users';
    $.getJSON(url, displayUsers);
  }

  function getGadgets(){
    var url = window.location.origin.replace(/\d{4}/,'4000')+'/gadgets';
    $.getJSON(url, displayGadgets);
  }

  function displayUsers(data){
    for(var i =0; i <data.users.length; i++){
      displayUser(data.users[i]);
    }
  }

  function displayGadgets(data){
    for(var i =0; i <data.gadgets.length; i++){
      displayGadget(data.gadgets[i]);
    }
  }

  function newUser(user){
    $('#user input').val('');
    toggleUser();
    displayUser(user);
  }

  function newGadget(gadget){
    $('#gadget input').val('');
    toggleGadget();
    displayGadget(gadget);
  }

  function displayUser(user){
    users.push(user);

    var $picture = $('<td>');
    $picture.addClass('picture');
    var $name = $('<td>');
    $name.addClass('name');
    var $balance = $('<td>');
    $balance.addClass('balance');
    var $purchases = $('<td>');
    $purchases.addClass('purchase');
    var $tr = $('<tr>');
    $tr.addClass('trow');

    var url = 'url("' +user.picture+'")';
    $picture.css('background', url);
    $picture.attr('data-user-id', user._id);
    $tr.attr('data-user-id', user._id);

    $name.text(user.name);
    $balance.text(user.balance);
    $purchases.text(user.purchases);

    $tr.append($picture, $name, $balance, $purchases);
    $('#users').append($tr);
  }

  function displayGadget(gadget){
    gadgets.push(gadget);

    var $picture = $('<td>');
    $picture.addClass('picture');
    var $name = $('<td>');
    $name.addClass('name');
    var $cost = $('<td>');
    $cost.addClass('cost');
    var $amount = $('<td>');
    $amount.addClass('amount');
    var $purchase = $('<td>');
    $purchase.addClass('purchase');
    var $tr = $('<tr>');
    $tr.addClass('trow');

    $purchase.text('Purchase');
    $purchase.attr('data-gadget-id', gadget._id);

    var url = 'url("' +gadget.picture+'")';
    $picture.css('background', url);
    $picture.attr('data-gadget-id', gadget._id);
    $tr.attr('data-gadget-id', gadget._id);

    $name.text(gadget.name);
    $cost.text(gadget.cost);
    $amount.text(gadget.amount);

    $tr.append($purchase, $picture, $name, $cost, $amount);
    $('#gadgets').append($tr);
  }


  function populateUser(){
    toggleUser();

    var id =$(this).parent().data('user-id');
    var user = _.find(users, function(user){return user._id === id;});

    $('input[name="_id"]').val(user._id);
    $('input[name="name"]').val(user.name);
    $('input[name="balance"]').val(user.balance);
    $('input[name="purchases"]').val(user.purchases);
    $('input[name="picture"]').val(user.picture);
  }

  function populateGadget(){
    toggleGadget();

    var id =$(this).parent().data('gadget-id');
    var gadget = _.find(gadgets, function(gadget){return gadget._id === id;});

    $('input[name="_id"]').val(gadget._id);
    $('input[name="name"]').val(gadget.name);
    $('input[name="cost"]').val(gadget.cost);
    $('input[name="amount"]').val(gadget.amount);
    $('input[name="picture"]').val(gadget.picture);
  }

  function updateUser(){
    var data = $('#user').serialize();
    var id = $('input[name="_id"]').val();
    var url = window.location.origin.replace(/\d{4}/, '4000') + '/users/' + id;
    var type = 'PUT';
    var success = changeUser;
    console.log(id);

    $.ajax({url:url, type:type, data:data, success:success});

    event.preventDefault();
  }

  function updateGadget(){
    var data = $('#gadget').serialize();
    var id = $('input[name="_id"]').val();
    var url = window.location.origin.replace(/\d{4}/, '4000') + '/gadgets/' + id;
    var type = 'PUT';
    var success = changeGadget;
    console.log(id);

    $.ajax({url:url, type:type, data:data, success:success});

    event.preventDefault();
  }

  function changeUser(data){
    if(data.updated ===1){
      _.remove(users, function(user){return user._id === data.id;});
      users.push(data.user);

      var $tr = $('.trow[data-user-id="'+data.id+'"]');
      $tr.find('.name').text(data.user.name);
      $tr.find('.balance').text(data.user.balance);
      $tr.find('.purchase').text(data.user.purchases);
      var url = 'url("' +data.user.picture+'")';
      $tr.find('.picture').css('background', url);
    }
  }

  function changeGadget(data){
    if(data.updated ===1){
      _.remove(gadgets, function(gadget){return gadget._id === data.id;});
      gadgets.push(data.gadget);

      var $tr = $('.trow[data-gadget-id="'+data.id+'"]');
      $tr.find('.name').text(data.gadget.name);
      $tr.find('.cost').text(data.gadget.cost);
      $tr.find('.amount').text(data.gadget.amount);
      var url = 'url("' +data.gadget.picture+'")';
      $tr.find('.picture').css('background', url);
    }
  }

  function deleteUser(){
    var id = $('input[name="_id"]').val();
    var url = window.location.origin.replace(/\d{4}/, '4000') + '/users/' + id;
    var type = 'DELETE';
    var success= removeUser;

    $.ajax({url:url, type:type, success:success});
    event.preventDefault();
  }

  function deleteGadget(){
    var id = $('input[name="_id"]').val();
    var url = window.location.origin.replace(/\d{4}/, '4000') + '/gadgets/' + id;
    var type = 'DELETE';
    var success= removeGadget;

    $.ajax({url:url, type:type, success:success});
    event.preventDefault();
  }

  function removeUser(data){
    if(data.deleted === 1){
      _.remove(users, function(user){return user._id === data.id;});
      $('.trow[data-user-id="'+data.id+'"]').remove();
    }
  }

  function removeGadget(data){
    if(data.deleted === 1){
      _.remove(gadgets, function(gadget){return gadget._id === data.id;});
      $('.trow[data-gadget-id="'+data.id+'"]').remove();
    }
  }


})();

