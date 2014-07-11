(function ($) {
  Drupal.doji_gold_price = Drupal.doji_gold_price || {}
  Drupal.doji_gold_price.suggest = Drupal.doji_gold_price.suggest || {}

  //Return number
  Drupal.doji_gold_price.toNumber = function($input) {
    var number = $input.val();
    if (number.length > 0 && Drupal.settings.format_number.thousands_sep.length > 0) {
      var thsep = Drupal.settings.format_number.thousands_sep;
      if (thsep == '\u00A0') {
        thsep += ' ';
      }
      number = number.replace(new RegExp('['+ thsep +']', 'g'), '');
    }

    number = parseFloat(number);

    if (isNaN(number)) {
      number = 0;
    }

    return number;
  };

  //Set value into Goldprice Form
  Drupal.doji_gold_price.goldprice_form_set_value = function($form, $input, $click_spread, $i) {
    var id = $input.attr('id').replace('edit-', 'edit-field-') + '-0-value';

    if ($input.parents('.form-ngunggiaodich:eq(0)').length) {
      return false;
    }

    if ($('#' + id).length > 0) {
      $('#' + id).val($input.val());
      Drupal.goldpriceCalculator.calculator($('#' + id));
    }
  }

  //Caculator function
  Drupal.doji_gold_price.calculator = function($form, $input, $click_spread, $i) {
    var value = Drupal.doji_gold_price.toNumber($input);
    value += $click_spread*$i;
    $input.val(value);
    Drupal.numericElement.formatElement($input, -1);
//    Drupal.doji_gold_price.goldprice_form_set_value($form, $input, $click_spread, $i);
    Drupal.doji_gold_price.suggest.rule_1($form, $input, $click_spread, $i);
  }

  //Suggest rule 1 function
  Drupal.doji_gold_price.suggest.rule_1 = function($form, $input, $click_spread, $i) {
    if ($input.hasClass('hn-pushall')) {
      $('input.form-text.hn', $form).each(function(){
        Drupal.doji_gold_price.calculator($form, $(this), $click_spread, $i);
      });
    }
    if ($input.hasClass('sg-pushall')) {
      $('input.form-text.sg', $form).each(function(){
        Drupal.doji_gold_price.calculator($form, $(this), $click_spread, $i);
      });
    }
    if ($input.hasClass('phi-pushall')) {
      $('input.form-text.phi', $form).each(function(){
        Drupal.doji_gold_price.calculator($form, $(this), $click_spread, $i);
      });
    }
    if ($input.hasClass('nl999-pushall')) {
      $('input.form-text.nl999', $form).each(function(){
        Drupal.doji_gold_price.calculator($form, $(this), $click_spread, $i);
      });
    }
    if ($input.hasClass('nl99-pushall')) {
      $('input.form-text.nl99', $form).each(function(){
        Drupal.doji_gold_price.calculator($form, $(this), $click_spread, $i);
      });
    }
  }

  //Suggest rule 2 function
  Drupal.doji_gold_price.suggest.rule_2 = function($sjc_le_muavao, $sjc_le_banra, $sjc_buon_muavao, $sjc_buon_banra) {
    //Drupal.doji_gold_price.goldprice_form_set_value($form, $input, $click_spread, $i);
    var $res = new Array();
    var $sjc_le_muavao_value = Drupal.doji_gold_price.toNumber($sjc_le_muavao);
    var $sjc_le_banra_value = Drupal.doji_gold_price.toNumber($sjc_le_banra);
    var $sjc_buon_muavao_value = Drupal.doji_gold_price.toNumber($sjc_buon_muavao);
    var $sjc_buon_banra_value = Drupal.doji_gold_price.toNumber($sjc_buon_banra);
    var $messages = $('<div id="messages"><div class="messages error"> </div></div>');
    var $noitce_message = $('#noitce-message');
    var $ul = $('#noitce-message ul');
    $('#giavangtrongnuoc #noitce-message ul li:not(".first")').remove();
    $res['warning'] = 0;
    $res['error'] = 0;

    if ($sjc_le_banra_value < $sjc_le_muavao_value) {
      $res['error'] += 1;
      $sjc_le_muavao.addClass('error');
      $sjc_le_banra.addClass('error');
      $ul.append('<li class="error">DOJI HN mua lẻ > DOJI HN bán lẻ</li>');
    }
    else if ($sjc_le_muavao_value > 0 && $sjc_le_banra_value > 0 && ((($sjc_le_banra_value - $sjc_le_muavao_value)/$sjc_le_banra_value) > 0.01)) {
      $res['warning'] += 1;
      $ul.append('<li class="warning">DOJI HN lẻ có biên độ thay đổi quá 1%</li>');
    }
    else {
      $sjc_le_muavao.removeClass('error');
      $sjc_le_banra.removeClass('error');
    }

    if ($sjc_buon_banra_value < $sjc_buon_muavao_value) {
      $res['error'] += 1;
      $sjc_buon_banra.addClass('error');
      $sjc_buon_muavao.addClass('error');
      $ul.append('<li class="error">DOJI HN mua buôn > DOJI HN bán buôn</li>');
    }
    else if ($sjc_buon_muavao_value > 0 && $sjc_buon_banra_value > 0 && ((($sjc_buon_banra_value - $sjc_buon_muavao_value)/$sjc_buon_muavao_value) > 0.01)) {
      $res['warning'] += 1;
      $ul.append('<li class="warning">DOJI HN buôn có biên độ thay đổi quá 1%</li>');
    }
    else {
      $sjc_buon_banra.removeClass('error');
      $sjc_buon_muavao.removeClass('error');
    }

    if ($sjc_le_muavao_value > $sjc_buon_muavao_value) {
      $res['error'] += 1;
      $sjc_buon_muavao.addClass('error');
      $sjc_le_muavao.removeClass('error');
      $ul.append('<li class="error">DOJI HN mua lẻ > DOJI HN mua buôn</li>');
    }
    else if (!$res['error']) {
      $sjc_buon_muavao.removeClass('error');
      $sjc_le_muavao.removeClass('error');
    }

    if ($sjc_le_banra_value < $sjc_buon_banra_value) {
      $res['error'] += 1;
      $sjc_le_banra.addClass('error');
      $sjc_buon_banra.removeClass('error');
      $ul.append('<li class="error">DOJI HN bán buôn > DOJI HN bán lẻ</li>');
    }
    else if (!$res['error']) {
      $sjc_le_banra.removeClass('error');
      $sjc_buon_banra.removeClass('error');
    }

    if ($res['error'] > 0 || $res['warning'] > 0 ) {
      $noitce_message.append($ul);
    }
    else {
     // $noitce_message.html();
    }
    return $res;
  }

  //Suggest rule 3 function
  Drupal.doji_gold_price.suggest.rule_3 = function($sjc_le_muavao, $sjc_le_banra, $sjc_buon_muavao, $sjc_buon_banra) {
    //Drupal.doji_gold_price.goldprice_form_set_value($form, $input, $click_spread, $i);
    var $res = new Array();
    var $sjc_le_muavao_value = Drupal.doji_gold_price.toNumber($sjc_le_muavao);
    var $sjc_le_banra_value = Drupal.doji_gold_price.toNumber($sjc_le_banra);
    var $sjc_buon_muavao_value = Drupal.doji_gold_price.toNumber($sjc_buon_muavao);
    var $sjc_buon_banra_value = Drupal.doji_gold_price.toNumber($sjc_buon_banra);
    var $messages = $('<div id="messages"><div class="messages error"> </div></div>');
    var $noitce_message = $('#noitce-message');
    var $ul = $('#noitce-message ul');
    $res['warning'] = 0;
    $res['error'] = 0;

    if ($sjc_le_banra_value < $sjc_le_muavao_value) {
      $res['error'] += 1;
      $sjc_le_muavao.addClass('error');
      $sjc_le_banra.addClass('error');
      $ul.append('<li class="error">DOJI HCM mua lẻ > DOJI HCM bán lẻ</li>');
    }
    else if ($sjc_le_muavao_value > 0 && $sjc_le_banra_value > 0 && ((($sjc_le_banra_value - $sjc_le_muavao_value)/$sjc_le_banra_value) > 0.01)) {
      $res['warning'] += 1;
      $ul.append('<li class="warning">DOJI HCM lẻ có biên độ thay đổi quá 1%</li>');
    }
    else {
      $sjc_le_muavao.removeClass('error');
      $sjc_le_banra.removeClass('error');
    }

    if ($sjc_buon_banra_value < $sjc_buon_muavao_value) {
      $res['error'] += 1;
      $sjc_buon_banra.addClass('error');
      $sjc_buon_muavao.addClass('error');
      $ul.append('<li class="error">DOJI HCM mua buôn > DOJI HCM bán buôn</li>');
    }
    else if ($sjc_buon_muavao_value > 0 && $sjc_buon_banra_value > 0 && ((($sjc_buon_banra_value - $sjc_buon_muavao_value)/$sjc_buon_muavao_value) > 0.01)) {
      $res['warning'] += 1;
      $ul.append('<li class="warning">DOJI HCM buôn có biên độ thay đổi quá 1%</li>');
    }
    else {
      $sjc_buon_banra.removeClass('error');
      $sjc_buon_muavao.removeClass('error');
    }

    if ($sjc_le_muavao_value > $sjc_buon_muavao_value) {
      $res['error'] += 1;
      $sjc_buon_muavao.addClass('error');
      $sjc_le_muavao.removeClass('error');
      $ul.append('<li class="error">DOJI HCM mua lẻ > DOJI HCM mua buôn</li>');
    }
    else if (!$res['error']) {
      $sjc_buon_muavao.removeClass('error');
      $sjc_le_muavao.removeClass('error');
    }

    if ($sjc_le_banra_value < $sjc_buon_banra_value) {
      $res['error'] += 1;
      $sjc_le_banra.addClass('error');
      $sjc_buon_banra.removeClass('error');
      $ul.append('<li class="error">DOJI HCM bán buôn > DOJI HCM bán lẻ</li>');
    }
    else if (!$res['error']) {
      $sjc_le_banra.removeClass('error');
      $sjc_buon_banra.removeClass('error');
    }

    if ($res['error'] > 0 || $res['warning'] > 0 ) {
      $noitce_message.append($ul);
    }
    return $res;
  }

  /******************************************
  * Kiem tra cho Vang Phi SJC (99.99)
  * Mua <= DOJI HN mua lẻ
  * Bán <= DOJI HN bán lẻ
  * Mua <= Bán
  ******************************************/
  Drupal.doji_gold_price.suggest.rule_4 = function($sjc_hn_le_muavao, $sjc_hn_le_banra, $phi_sjc_9999_muavao, $phi_sjc_9999_banra) {
    var $res = new Array();
    var $sjc_hn_le_muavao_value = Drupal.doji_gold_price.toNumber($sjc_hn_le_muavao);
    var $sjc_hn_le_banra_value = Drupal.doji_gold_price.toNumber($sjc_hn_le_banra);
    var $phi_sjc_9999_muavao_value = Drupal.doji_gold_price.toNumber($phi_sjc_9999_muavao);
    var $phi_sjc_9999_banra_value = Drupal.doji_gold_price.toNumber($phi_sjc_9999_banra);
    var $messages = $('<div id="messages"><div class="messages error"> </div></div>');
    var $noitce_message = $('#noitce-message');
    var $ul = $('#noitce-message ul');
    $res['warning'] = 0;
    $res['error'] = 0;

    if ($phi_sjc_9999_banra_value < $phi_sjc_9999_muavao_value) {
      $res['error'] += 1;
      $phi_sjc_9999_muavao.addClass('error');
      $phi_sjc_9999_banra.addClass('error');
      $ul.append('<li class="error">Phi SJC (99.99) mua > Phi SJC (99.99) bán</li>');
    }
    else if ($phi_sjc_9999_muavao_value > 0 && $phi_sjc_9999_banra_value > 0 && ((($phi_sjc_9999_banra_value - $phi_sjc_9999_muavao_value)/$phi_sjc_9999_banra_value) > 0.01)) {
      $res['warning'] += 1;
      $ul.append('<li class="warning">Phi SJC (99.99) có biên độ thay đổi quá 1%</li>');
    }
    else {
      $phi_sjc_9999_muavao.removeClass('error');
      $phi_sjc_9999_banra.removeClass('error');
    }

    if ($res['error'] > 0 || $res['warning'] > 0 ) {
      $noitce_message.append($ul);
    }
    return $res;
  }

  /******************************************
  * Kiem tra cho Vàng Nguyên liệu (999.9)
  * Mua <= Vàng phi SJC mua x 999.9/999.99
  * Bán <= Vàng phi SJC bán x 999.9/999.99
  * Mua <= Bán
  ******************************************/
  Drupal.doji_gold_price.suggest.rule_5 = function($nguyen_lieu_999_muavao, $nguyen_lieu_999_banra, $phi_sjc_9999_muavao, $phi_sjc_9999_banra) {
    var $res = new Array();
    var $nguyen_lieu_999_muavao_value = Drupal.doji_gold_price.toNumber($nguyen_lieu_999_muavao);
    var $nguyen_lieu_999_banra_value = Drupal.doji_gold_price.toNumber($nguyen_lieu_999_banra);
    var $phi_sjc_9999_muavao_value = Drupal.doji_gold_price.toNumber($phi_sjc_9999_muavao);
    var $phi_sjc_9999_banra_value = Drupal.doji_gold_price.toNumber($phi_sjc_9999_banra);
    var $messages = $('<div id="messages"><div class="messages error"> </div></div>');
    var $noitce_message = $('#noitce-message');
    var $ul = $('#noitce-message ul');
    $res['warning'] = 0;
    $res['error'] = 0;

    if ($nguyen_lieu_999_banra_value < $nguyen_lieu_999_muavao_value) {
      $res['error'] += 1;
      $nguyen_lieu_999_muavao.addClass('error');
      $nguyen_lieu_999_banra.addClass('error');
      $ul.append('<li class="error">Nguyên liệu 999.9 mua > Nguyên liệu 999.9 bán</li>');
    }
    else if ($nguyen_lieu_999_muavao_value > 0 && $nguyen_lieu_999_banra_value > 0 && ((($nguyen_lieu_999_banra_value - $nguyen_lieu_999_muavao_value)/$nguyen_lieu_999_banra_value) > 0.01)) {
      $res['warning'] += 1;
      $ul.append('<li class="warning">Nguyên liệu 999.9 có biên độ thay đổi quá 1%</li>');
    }
    else {
      $nguyen_lieu_999_muavao.removeClass('error');
      $nguyen_lieu_999_banra.removeClass('error');
    }

    if ($res['error'] > 0 || $res['warning'] > 0 ) {
      $noitce_message.append($ul);
    }

    return $res;
  }

  /******************************************
  * Kiem tra cho Vàng Nguyên liệu (99.9)
  * Mua <= Vàng Phi SJC mua x 99.9/99.99
  * Bán <= Vàng phi SJC bán x 99.9/99.99
  * Mua <= Bán
  ******************************************/
  Drupal.doji_gold_price.suggest.rule_6 = function($nguyen_lieu_99_muavao, $nguyen_lieu_99_banra, $phi_sjc_9999_muavao, $phi_sjc_9999_banra) {
    var $res = new Array();
    var $nguyen_lieu_99_muavao_value = Drupal.doji_gold_price.toNumber($nguyen_lieu_99_muavao);
    var $nguyen_lieu_99_banra_value = Drupal.doji_gold_price.toNumber($nguyen_lieu_99_banra);
    var $phi_sjc_9999_muavao_value = Drupal.doji_gold_price.toNumber($phi_sjc_9999_muavao);
    var $phi_sjc_9999_banra_value = Drupal.doji_gold_price.toNumber($phi_sjc_9999_banra);
    var $messages = $('<div id="messages"><div class="messages error"> </div></div>');
    var $noitce_message = $('#noitce-message');
    var $ul = $('#noitce-message ul');
    $res['warning'] = 0;
    $res['error'] = 0;

    if ($nguyen_lieu_99_banra_value < $nguyen_lieu_99_muavao_value) {
      $res['error'] += 1;
      $nguyen_lieu_99_banra.addClass('error');
      $nguyen_lieu_99_muavao.addClass('error');
      $ul.append('<li class="error">Nguyên liệu 99.9 mua > Nguyên liệu 99.9 bán </li>');
    }
    else if ($nguyen_lieu_99_muavao_value > 0 && $nguyen_lieu_99_banra_value > 0 && ((($nguyen_lieu_99_banra_value - $nguyen_lieu_99_muavao_value)/$nguyen_lieu_99_banra_value) > 0.01)) {
      $res['warning'] += 1;
      $ul.append('<li class="warning">Nguyên liệu 99.9 có biên độ thay đổi quá 1%</li>');
    }
    else {
      $nguyen_lieu_99_banra.removeClass('error');
      $nguyen_lieu_99_muavao.removeClass('error');
    }

    if ($res['error'] > 0 || $res['warning'] > 0 ) {
      $noitce_message.append($ul);
    }
    return $res;
  }

Drupal.behaviors.doji_gold_price = function(context) {
  $('#doji-admin-settings table.admin-tbl-gold .do-edit', context).each(function() {
    var $do_edit = $(this);
    var $tr = $(this).parents('tr:first');
    var $do_cancel = $tr.find('.do-cancel:first');
    var $do_save = $tr.find('.do-save:first');
    var $do_update_status = $tr.find('.do-update-status:first');
    var $span = $(this).next('span');
    $tr.find('.form-text').attr('disabled', 'true');

    $do_edit.click(function(){
      $(this).hide();
      $span.show();
      $tr.addClass('active');
      $tr.find('.form-text').removeAttr('disabled');
      return false;
    });
    $do_cancel.click(function(){
      $tr.removeClass('active');
      $tr.find('.form-text').attr('disabled', 'true');
      $span.hide();
      $do_edit.show();
      return false;
    });
    $do_save.click(function(){
      var $form = $do_save.parents('form:first');
      $span.after('<span>' + Drupal.t("Lưu dữ liệu") + '<span class="views-throbbing">&nbsp</span></span>');
      $span.hide();
      $.post($(this).attr('action'), $form.serialize(),
        function(data){
          $do_edit.show();
          $tr.removeClass('active');
          $tr.find('.form-text').attr('disabled', 'true');
          $span.next('span').remove();
        }
      , "json");
      return false;
    });
    $do_update_status.click(function(){
      $tr.find('.form-text').removeAttr('disabled');
      var $form = $do_save.parents('form:first');
      $span.after('<span>' + Drupal.t("Lưu dữ liệu") + '<span class="views-throbbing">&nbsp</span></span>');
      $span.hide();
      $.post($(this).attr('action'), $form.serialize(),
        function(data){
          if (data.text) {
            $do_update_status.text(data.text);
          }
          $tr.find('.form-text').attr('disabled', 'true');
          $span.next('span').remove();
        }
      , "json");
      return false;
    });
  });

  // Bind submit event callback to the form.
  $('#doji-admin-settings .form-submit').click(function() {
    $('#doji-admin-settings input.form-text').removeAttr('disabled');
  });

  $('.form-goldprice-updown .btn-updown-children', context).each(function() {
    var $element = $(this);
    var $form = $element.parents('form:first');
    var $input = $element.parents('.goldprice-td:first').find('input:first');
    //DOJI HN
    var $sjc_le_muavao = $form.find('#edit-sjc-le-muavao');
    var $sjc_le_banra = $form.find('#edit-sjc-le-banra');
    var $sjc_buon_muavao = $form.find('#edit-sjc-buon-muavao');
    var $sjc_buon_banra = $form.find('#edit-sjc-buon-banra');
    //DOJI SG
    var $sjc_sg_le_muavao = $form.find('#edit-sjc-sg-le-muavao');
    var $sjc_sg_le_banra = $form.find('#edit-sjc-sg-le-banra');
    var $sjc_sg_buon_muavao = $form.find('#edit-sjc-sg-buon-muavao');
    var $sjc_sg_buon_banra = $form.find('#edit-sjc-sg-buon-banra');
    //PHI SJC (99.99)
    var $phi_sjc_9999_muavao = $form.find('#edit-phi-sjc-9999-muavao');
    var $phi_sjc_9999_banra = $form.find('#edit-phi-sjc-9999-banra');
    //NGUYÊN LIỆU (99.9)
    var $nguyen_lieu_999_muavao = $form.find('#edit-nguyen-lieu-999-muavao');
    var $nguyen_lieu_999_banra = $form.find('#edit-nguyen-lieu-999-banra');
    //NGUYÊN LIỆU (99)
    var $nguyen_lieu_99_muavao = $form.find('#edit-nguyen-lieu-99-muavao');
    var $nguyen_lieu_99_banra = $form.find('#edit-nguyen-lieu-99-banra');

    //GET VARIABLE
    var $spread = parseFloat(Drupal.settings.doji_gold_price.spread);
    var $banle_spread = parseFloat(Drupal.settings.doji_gold_price.banle_spread);
    var $banle_banbuon = parseFloat(Drupal.settings.doji_gold_price.banle_banbuon);
    var $click_spread = parseFloat(Drupal.settings.doji_gold_price.click_spread);

    //BIN ELEMENT EVENT
    $element.bind('click', function() {
      Drupal.numericElement.formatElement($input, decimals);
    }, function(){
      $i = 0;
      if ($element.hasClass('btn-up') || $element.hasClass('btn-down')) {
        $i = 1;
        if ($element.hasClass('btn-down')) {
          $i = -1;
        }
        if ($element.hasClass('disabled')) {
          $i = 0;
        }
      }

      Drupal.doji_gold_price.calculator($form, $input, $click_spread, $i);
      Drupal.doji_gold_price.suggest.rule_2($sjc_le_muavao, $sjc_le_banra, $sjc_buon_muavao, $sjc_buon_banra);
      Drupal.doji_gold_price.suggest.rule_3($sjc_sg_le_muavao, $sjc_sg_le_banra, $sjc_sg_buon_muavao, $sjc_sg_buon_banra);
      Drupal.doji_gold_price.suggest.rule_4($sjc_le_muavao, $sjc_le_banra, $phi_sjc_9999_muavao, $phi_sjc_9999_banra);
      Drupal.doji_gold_price.suggest.rule_5($nguyen_lieu_999_muavao, $nguyen_lieu_999_banra, $phi_sjc_9999_muavao, $phi_sjc_9999_banra);
      Drupal.doji_gold_price.suggest.rule_6($nguyen_lieu_99_muavao, $nguyen_lieu_99_banra, $phi_sjc_9999_muavao, $phi_sjc_9999_banra);
    });

    // Bind element events.
    $input.bind('keyup', function(e) {
      if (!e) {
        e = window.event;
      }

      if ($(this).hasClass('processed')) {
        $(this).removeClass('processed');
        return true;
      }

      $(this).addClass('processed');

      switch (e.keyCode) {
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
        case 20: // caps lock
        case 33: // page up
        case 34: // page down
        case 35: // end
        case 36: // home
        case 37: // left arrow
        case 39: // right arrow
        case 9:  // tab
        case 13: // enter
        case 27: // esc
        //case 38: // up arrow
        //case 40: // down arrow
        case 190: // down arrow
        case 188: // down arrow
          return true;
        default:
          if (e.keyCode == 38) {
            Drupal.doji_gold_price.calculator($form, $input, $click_spread, 1);
          }
          else if (e.keyCode == 40) {
            Drupal.doji_gold_price.calculator($form, $input, $click_spread, -1);
          }
          else if (e.keyCode < 48 || e.keyCode > 57) {
            return true;
          }

          Drupal.doji_gold_price.suggest.rule_2($sjc_le_muavao, $sjc_le_banra, $sjc_buon_muavao, $sjc_buon_banra);
          Drupal.doji_gold_price.suggest.rule_3($sjc_sg_le_muavao, $sjc_sg_le_banra, $sjc_sg_buon_muavao, $sjc_sg_buon_banra);
          Drupal.doji_gold_price.suggest.rule_4($sjc_le_muavao, $sjc_le_banra, $phi_sjc_9999_muavao, $phi_sjc_9999_banra);
          Drupal.doji_gold_price.suggest.rule_5($nguyen_lieu_999_muavao, $nguyen_lieu_999_banra, $phi_sjc_9999_muavao, $phi_sjc_9999_banra);
          Drupal.doji_gold_price.suggest.rule_6($nguyen_lieu_99_muavao, $nguyen_lieu_99_banra, $phi_sjc_9999_muavao, $phi_sjc_9999_banra);
      }
      $input.addClass('processed');
    });

    $input.bind('blur', function() {
      Drupal.numericElement.formatElement($input, -1);
    });
  });

  // Bind submit event callback to the form.
  $('.form-footer-container .form-submit').click(function() {
    var $form = $(this).parents('form:first');
    //DOJI HN
    var $sjc_le_muavao = $form.find('#edit-sjc-le-muavao');
    var $sjc_le_banra = $form.find('#edit-sjc-le-banra');
    var $sjc_buon_muavao = $form.find('#edit-sjc-buon-muavao');
    var $sjc_buon_banra = $form.find('#edit-sjc-buon-banra');
    //DOJI SG
    var $sjc_sg_le_muavao = $form.find('#edit-sjc-sg-le-muavao');
    var $sjc_sg_le_banra = $form.find('#edit-sjc-sg-le-banra');
    var $sjc_sg_buon_muavao = $form.find('#edit-sjc-sg-buon-muavao');
    var $sjc_sg_buon_banra = $form.find('#edit-sjc-sg-buon-banra');
    //PHI SJC (99.99)
    var $phi_sjc_9999_muavao = $form.find('#edit-phi-sjc-9999-muavao');
    var $phi_sjc_9999_banra = $form.find('#edit-phi-sjc-9999-banra');
    //NGUYÊN LI?U (99.9)
    var $nguyen_lieu_999_muavao = $form.find('#edit-nguyen-lieu-999-muavao');
    var $nguyen_lieu_999_banra = $form.find('#edit-nguyen-lieu-999-banra');
    //NGUYÊN LI?U (99)
    var $nguyen_lieu_99_muavao = $form.find('#edit-nguyen-lieu-99-muavao');
    var $nguyen_lieu_99_banra = $form.find('#edit-nguyen-lieu-99-banra');

    $form.find('input.form-text').each(function(){
      Drupal.doji_gold_price.goldprice_form_set_value($form, $(this), 0, 0);
    });

    $res = Drupal.doji_gold_price.suggest.rule_2($sjc_le_muavao, $sjc_le_banra, $sjc_buon_muavao, $sjc_buon_banra);
    $res1 = Drupal.doji_gold_price.suggest.rule_3($sjc_sg_le_muavao, $sjc_sg_le_banra, $sjc_sg_buon_muavao, $sjc_sg_buon_banra);
    $res2 = Drupal.doji_gold_price.suggest.rule_4($sjc_le_muavao, $sjc_le_banra, $phi_sjc_9999_muavao, $phi_sjc_9999_banra);
    $res3 = Drupal.doji_gold_price.suggest.rule_5($nguyen_lieu_999_muavao, $nguyen_lieu_999_banra, $phi_sjc_9999_muavao, $phi_sjc_9999_banra);
    $res4 = Drupal.doji_gold_price.suggest.rule_6($nguyen_lieu_99_muavao, $nguyen_lieu_99_banra, $phi_sjc_9999_muavao, $phi_sjc_9999_banra);

    $res['error'] += $res1['error'];
    $res['warning'] += $res1['warning'];

    $res['error'] += $res2['error'];
    $res['warning'] += $res2['warning'];

    $res['error'] += $res3['error'];
    $res['warning'] += $res3['warning'];

    $res['error'] += $res4['error'];
    $res['warning'] += $res4['warning'];

    if (!$res['error'] && !$res['warning']) {
      $('#goldprice-form .form-submit').click();
    }
    else {
      parent_height = $('#giavangtrongnuoc #gv-left').height();
      title_height = $('#gv-left-title').height();
      noitce_top = title_height + 20;
      noitce_height =  parent_height -  title_height;
      noitce_width = $('#gv-left').width();
      $noitce_message = $('#noitce-message');
      $noitce_message.css({'width': noitce_width, 'height': noitce_height, 'top': noitce_top});
      //$noitce_message.show();

      //if (!$res['error']) {
      //  $('#noitce-message .form-submit').show();
      //}

      //$('#noitce-message #edit-calcel').show();
        $('#goldprice-form .form-submit').click();
    }

    return false;
  });

  // Bind submit event callback to the form.
  $('#goldprice-form-v2 form.goldprice-form #edit-submit').click(function() {
    var $form = $(this).parents('form:first');
    var $sjc_le_muavao = $form.find('#edit-field-sjc-le-muavao-0-value');
    var $sjc_le_banra = $form.find('#edit-field-sjc-le-banra-0-value');
    var $sjc_buon_muavao = $form.find('#edit-field-sjc-buon-muavao-0-value');
    var $sjc_buon_banra = $form.find('#edit-field-sjc-buon-banra-0-value');

    parent_height = $form.height();
    noitce_top = 0;
    noitce_height =  parent_height;
    noitce_width = $('#goldprice-form-container').width();
    $noitce_message = $('#noitce-message');
    $noitce_message.css({'width': noitce_width, 'height': noitce_height, 'top': noitce_top});

    //Add noitce message
    $('#noitce-message ul li:not(".first")').remove();
    var $res = Drupal.doji_gold_price.suggest.rule_2($sjc_le_muavao, $sjc_le_banra, $sjc_buon_muavao, $sjc_buon_banra);

    $form.bind('submit', function() {
      $('input.gold-price-input', this).each(function() {
        $(this).removeAttr('disabled');
        Drupal.numericElement.clearThousandsSep($(this));
        if (Drupal.goldpriceCalculator.clearThousandsSep($(this)) < 0) {
          $res['error'] += 1;
          $(this).parents('tr:first').find('.form-text').addClass('error');
        }
      });

      if ($res['error'] > 0) {
        $('form.goldprice_js_disabled input.gold-price-input-disabled', context).each(function(){
          var $this = $(this);
          $this.attr('disabled', 'true');
        });
        $noitce_message.show();
        return false;
      }
      else {
        $('input.gold-price-input', $form).each(function() {
          $(this).removeAttr('disabled');
        })
/*
        if ($res['warning'] > 0) {
          $('#noitce-message .form-submit').show();
          $noitce_message.show();
          return false;
        }
*/
      }
    });

  });

  $('#noitce-message #edit-submit').click(function(){
    $('#goldprice-form .form-submit').click();
  });

  $('#noitce-message #edit-calcel').click(function(){
    $('#noitce-message').hide();
    //Kiem tra cac truong hien dang duoc disable hay enable va them truong ao
    if ($('#goldprice-form-container').length) {
      $('form.goldprice_js_disabled input.form-text').each(function(){
        Drupal.numericElement.formatElement($(this), -1);
        if ($(this).hasClass('gold-price-input-disabled')) {
         $(this).attr('disabled', 'true');
        }
      });
    }
    return false;
  });

  function goldprice_auto_index(context) {
    $('form.goldprice-form', context).each(function(){
      var $thisform = $(this);
      var index = 1;
      $thisform.find('.auto-index:visible').each(function(){
        $(this).text(index);
        index++;
      });
    });
  }

  function goldprice_auto_position($element) {
    var $formparent = $element.parents('form.goldprice-form:first');
    $addpriceitem = $formparent.find('.add-price-item:first');
    position      = $addpriceitem.position();
    width       = $addpriceitem.width();
    height      = $addpriceitem.height();
    $element.css({
        top             : position.top + height,
        left            : position.left
    });
  }

  $('form.goldprice-form .add-price-item', context).click(function(){
    var position      = $(this).position();
    var width       = $(this).width();
    var height      = $(this).height();
    $('#goldfield-item-hidden').css({
        top             : position.top + height,
        left            : position.left
    });
    $('#goldfield-item-hidden').toggle();
  });

  $('#goldfield-item-hidden .close', context).click(function(){
    $('#goldfield-item-hidden').toggle();
  });

  $('#goldfield-item-hidden .form-item .form-checkbox', context).each(function(){
    var $thischeckbox = $(this);
    $thischeckbox.click(function(){
      if ($(this).is(':checked')) {
        $('form.goldprice-form .'+ $(this).attr('fieldname')).show();
        goldprice_auto_position($(this).parents('#goldfield-item-hidden:first'));
        goldprice_auto_index(context);
        goldprice_status = 1;
      }
      else {
        $('form.goldprice-form .'+ $(this).attr('fieldname')).hide();
        goldprice_auto_position($(this).parents('#goldfield-item-hidden:first'));
        goldprice_auto_index(context);
        goldprice_status = 0;
      }
      //console.log($thischeckbox.attr('action') + '/' + $(this).attr('fieldname') + '/' + goldprice_status)
      $.get($thischeckbox.attr('action') + '/' + $(this).attr('fieldname') + '/' + goldprice_status, null,
        function(data){
          //oop
        }
      , "json");
    });
  });

  goldprice_auto_index(context);

  //Kiem tra cac truong hien dang duoc disable hay enable va them truong ao
  $('form.goldprice_js_disabled input.gold-price-input-disabled', context).each(function(){
    var $this = $(this);
    $this.attr('disabled', 'true');
  });

  $('#edit-add-goldprice').click(function(){
    $('#block-doji_gold_price-add_new_field').show();
    $(this).hide();
  });

  $('#doji-gold-price-add-new-field .form-submit').click(function(){
    var $form = $(this).parents('form:first');
    var error = 0;
    $form.find('.form-text').each(function(){
      if ($(this).hasClass('required') && $(this).val() == '') {
        $(this).addClass('error');
        error++;
      }
      else {
        $(this).removeClass('error');
      }
    })
    if (error) {
      return false;
    }
  });
};

})(jQuery);
