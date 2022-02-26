var key = '';
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('Key') != null) {
  key = urlParams.get('Key');
}

var host = 'https://tenderapi.spii.co.com';

$(document).ready(function () {
  getData();
});
var arr = [];

$('body').on('click', '.fa-plus', function () {
  $(this)
    .animate(
      {
        width: '30px',
        height: '30px',
        'font-size': '18px',
      },
      100
    )
    .addClass('selected');
  $(this)
    .siblings('.fa-minus')
    .animate(
      {
        width: '20px',
        height: '15px',
        'font-size': '14px',
      },
      100
    )
    .removeClass('selected');
  $(this)
    .parent()
    .siblings('input')
    .focus()
    .css({ 'border-color': '#2ec304', color: '#2ec304' });
  $(this).parent().siblings('span').css({ color: '#2ec304' });
});

$('body').on('click', '.fa-minus', function () {
  $(this)
    .animate(
      {
        width: '30px',
        height: '30px',
        'font-size': '18px',
      },
      100
    )
    .addClass('selected');
  $(this)
    .siblings('.fa-plus')
    .animate(
      {
        width: '20px',
        height: '15px',
        'font-size': '14px',
      },
      100
    )
    .removeClass('selected');
  $(this)
    .parent()
    .siblings('input')
    .focus()
    .css({ 'border-color': 'red', color: 'red' });
  $(this).parent().siblings('span').css({ color: 'red' });
});

$('body').on('click', '.no-offer', function () {
  let x = $(this).parent().children('i');
  if (x.hasClass('checked')) {
    x.removeClass('checked');
    x.parent().next().show();
  } else {
    x.addClass('checked');
    x.parent().next().hide();
  }
});

$('body').on('click', '.acknowledge', function () {
  let x = $(this).parent().children('i');
  if (x.hasClass('checked')) {
    x.removeClass('checked');
  } else {
    x.addClass('checked');
  }
});

function getData() {
  $('.tender').hide();
  $('.message').html('<h2>Loading... Please Wait</h2>').show();
  fetch(host + '/tender/' + key, { mode: 'cors' })
    .then((response) => response.json())
    .then((data) => loadTender(data[0]));
}

function loadTender(x) {
  arr = x;
  if (x.Tender == null) {
    $('.tender').hide();
    $('.message').html('<h2>Your tender key is not valid.</h2>').show();
  } else if (x.Tender[0].ClosingDate < x.ServerDate) {
    $('.tender').hide();
    $('.message')
      .html(
        '<h2>This tender is closed and no longer accepts financial offers.</h2>'
      )
      .show();
  } else if (x.AlreadySubmitted == 1) {
    $('.tender').hide();
    $('.message')
      .html(
        '<h2>You have already submitted your financial offer. If you want to modify your previous offer click on below button to submit a new one.</h2>' +
        '<input type="button" class="btnDiscard" value="Discard previous offer and submit a new one"/>'
      )
      .show();
  } else {
    placeTenderInfo();
  }
}

function placeTenderInfo() {
  $('.tender span:eq(1)').html(arr.Tender[0].TenderNo);
  document.title = 'SPII Tender no. ' + arr.Tender[0].TenderNo;
  $('.tender span:eq(1)').html(arr.Customer[0].Title);
  $('.tender span:eq(2)').html(arr.Tender[0].Subject);
  $('.tender span:eq(3)').html(arr.Tender[0].PaymentTerm);
  $('.tender span:eq(4)').html(arr.Tender[0].DeliveryTerm);
  $('.tender span:eq(5)').html(arr.Tender[0].Cur);
  if (arr.Tender[0].Note == null || arr.Tender[0].Note == '') {
    $('.tender span:eq(6)').closest('p').hide();
  } else {
    $('.tender span:eq(6)').html(arr.Tender[0].Note);
  }
  loadProducts(arr);
  $('.message').hide();
  $('.tender').show();
}

function loadProducts(arr) {
  console.log(arr);
  if (arr == null) {
  } else if (arr.Tender[0].Closed == 1) {
  } else {
    var res = '';

    arr.Products.map(function (el, i) {
      res +=
        `
      <div class="product" idtenderproduct="` +
        el.IdTenderProduct +
        `">
              <p>
                <b>Row: </b>
                <spn> ` +
        (i + 1) +
        ` </spn>
              </p>
              <p>
                <b>commodity: </b>
                <spn>` +
        el.Commodity +
        `</spn>
              </p>
              <p>
                <b>Maximum Quantity: </b>
                <spn>` +
        el.Qty +
        `MT</spn>
              </p>
              <p>
                <b>Price Formula: </b>
                <spn>` +
        el.PriceFormula +
        `</spn>
              </p>
              <p>
                <i class="no-offer fas fa-check"></i>
                <span class="no-offer">We are not interested in providing financial offer for this item.</span>
              </p>
              
              <div class="offers">
                <hr/>
                <span>Fill your financial offer here.</span>
                <div class="qty offer">
                  <div class="label">
                    Quantity: 
                  </div>
                  <input type="number" style="border-color: rgb(5, 141, 73);" maxlength="6" min="0" max="50000"
                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">
                  <span>MT</span>
                </div>` +
        (el.IdPublication == 999999
          ? `<div class="price offer">
                  <div class="label">
                    Price: 
                  </div>
                  <input type="number" style="border-color: rgb(5, 141, 73);" maxlength="7" min="0" max="50000"
                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">
                  <span>`+ arr.Tender[0].Cur + `</span>
                </div>`
          : ``) +
        (el.PercentageInput == 1
          ? `<div class="percent offer">
                  <div class="label">
                    increase/Decrease</br>(Percentage): 
                  </div>
                  <div class="textbox">
                    <div class="signs">
                      <i class="fas fa-plus selected"></i>
                      <i class="fas fa-minus"></i>
                    </div>
                    <input type="number" style="border-color: #2ec304;" maxlength="4" min="0" max="99" 
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">
                    <span style="color:#2ec304">%</span>
                  </div>
                </div>`
          : ``) +
        (el.AmountInput == 1
          ? `<div class="amount offer">
                  <div class="label">
                    increase/decrease</br>(Amount): 
                  </div>
                  <div class="textbox">
                    <div class="signs">
                    <i class="fas fa-plus selected"></i>
                    <i class="fas fa-minus"></i>
                    </div>
                    <input type="number" style="border-color: #2ec304;" maxlength="5" min="0" max="99"
                    oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null">
                    <span style="color:#2ec304">USD</span>
                  </div>
                </div>`
          : ``) +
        `
              </div>
            </div>
      `;
    });

    $('.products').html(res);
  }
}

$('body').on('click', '.btnDiscard', function () {
  placeTenderInfo();
});

$('.btnSubmit').click(function () {
  var vch = [];
  var emptyqty = 0;

  $('.product').each(function () {
    if (!$(this).find('i.no-offer').hasClass('checked')) {
      if ($(this).find('.qty').find('input').val() > 0) {
        vch.push({
          idtenderproduct: $(this).attr('idtenderproduct'),
          qty: $(this).find('.qty').find('input').val(),
          price: $(this).find('.price').length
            ? $(this).find('.price').find('input').val()
            : null,
          plusminuspercent: $(this).find('.percent').length
            ? $(this).find('.percent').find('input').val() *
            ($(this).find('.fa-plus').hasClass('selected')
              ? 1
              : $(this).find('.fa-minus').hasClass('selected')
                ? -1
                : null)
            : null,
          plusminusamount: $(this).find('.amount').length
            ? $(this).find('.amount').find('input').val() *
            ($(this).find('.fa-plus').hasClass('selected')
              ? 1
              : $(this).find('.fa-minus').hasClass('selected')
                ? -1
                : null)
            : null,
        });
      } else {
        alert('Quantity is not determined.');
        emptyqty = 1;
      }
    }
  });

  if (emptyqty == 1) {
    alert('Quantity is not determined.');
  } else if (!$('i.acknowledge').hasClass('checked')) {
    alert('Please read and confirm the acknowledgement.');
  } else {
    //console.log(JSON.stringify(vch));

    $('.btnSubmit').prop('disabled', true);

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify(JSON.stringify(vch));

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(host + '/tender/' + key, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        if (result.includes('Success')) {
          $('.tender').hide();
          $('.message')
            .html(
              '<h2>Your financial offer is successfully submitted. You will receive a copy of your submitted proposal on your mailbox. </h2>'
            )
            .show();
          $('.btnSubmit').prop('disabled', false);
        }
      })
      .catch((error) => {
        $('.btnSubmit').prop('disabled', false);
      });
  }
});

$('body').on('input', "input[type='number']", function () { });
