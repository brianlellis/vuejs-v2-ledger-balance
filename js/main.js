Vue.component('account-record-input', {
  template: `
    <div id="ledger-input">
      <h2>Accounts Recievable Form</h2>
      <select class="act-type">
        <option>Deduction</option>
        <option>Addition</option>
      </select>
      <input type="text" class="amount" name="amount" placeholder="Amount" />
      <input type="text" class="company" name="Company" placeholder="Company" />
      <input type="text" class="invoice" name="invoice-number" placeholder="Invoice #" />
      <input type="text" class="datepicker" placeholder="Select a Date" />
      <button id="ledger-add-button">ADD</button>
    </div>
    `
});

Vue.component('account-record-display', {
  template: `
    <tr class="deduction">
      <td class="icon"><div></div></td>
      <td class="name">
        <p class="bill">Apple iPhone 6, 6g GB<p>
        <p class="invoice-date">Electronics #343223  - 12 July, 2015</p>
      </td>
      <td class="amount">$650.<sup>00</sup><span class="remove-data">Remove</span></td>
    </tr>
  `
});
// <!--    <tr class="addition">-->
// <!--      <td class="icon"><div></div></td>-->
// <!--      <td class="name">-->
//   <!--        <p class="bill">Apple iPhone 6, 6g GB<p>-->
//   <!--        <p class="invoice-date">Electronics #343223  - 12 July, 2015</p>-->
//   <!--      </td>-->
//   <!--      <td class="amount">$650.<sup>75</sup><span class="remove-data">Remove</span></td>-->
//   <!--    </tr>-->

Vue.component('account-header', {
  template: `
    <h2>Current Balance
      <span>$729.<sup>00</sup></span>
    </h2>
  `
});

Vue.component('stylesheets', {
  data: function() {
    return {
      parsed_sheets: this.sheets.split(',').map(value => value+'.css')
    }
  },
  props: {
    sheets: String
  },
  template: `
    <div style="display: none">
      <link v-for="sheet in parsed_sheets" rel="stylesheet" :href="sheet">
    </div>
  `
});

Vue.component('js-scripts', {
  data: function() {
    return {
      parsed_sheets: this.sheets.split(',').map(value => value+'.js')
    }
  },
  props: {
    sheets: String
  },
  template: `
    <div style="display: none">
      <script v-for="sheet in parsed_sheets" :src="sheet"></script>
    </div>
  `
});

Vue.component('wallet', {
  template: `
    <div class="wallet">
      <h2>My Wallets<span id="add-credit-card">+</span></h2>
      <!--ADD CREDIT CARD FORM -->
      <div id="add-cc-form" class="hidden">
        <div id="cc-type" class="nothing"></div>
        <input id="cc-number-input" type="text" placeholder="Credit Card #" maxlength="19" />
        <select class="cc-exp-month">
          <option value="01">JAN</option>
          <option value="02">FEB</option>
          <option value="03">MAR</option>
          <option value="04">APR</option>
          <option value="05">MAY</option>
          <option value="06">JUN</option>
          <option value="07">JUL</option>
          <option value="08">AUG</option>
          <option value="09">SEPT</option>
          <option value="10">OCT</option>
          <option value="11">NOV</option>
          <option value="12">DEC</option>
        </select>
        <select class="cc-exp-year">
          <option value="17">2017</option>
          <option value="18">2018</option>
          <option value="19">2019</option>
          <option value="20">2020</option>
          <option value="21">2021</option>
          <option value="22">2022</option>
        </select>
        <button id="cc-add-button">ADD</button>
      </div>

      <div class="scrollme">
        <div class="credit-card"><div id="cc-card-logo" class="visa"></div>
          <p class="cc-num"><sub>**** **** ****</sub> 2562</p>
          <p class="cc-exp">Valid Thru: 12/17</p>
          <span class="remove-data">Remove</span>
        </div>
        <div class="credit-card selected"><div id="cc-card-logo" class="mc"></div>
          <p class="cc-num"><sub>**** **** ****</sub> 2562</p>
          <p class="cc-exp">Valid Thru: 12/17</p>
          <span class="remove-data">Remove</span>
        </div>
        <div class="credit-card"><div id="cc-card-logo" class="visa"></div>
          <p class="cc-num"><sub>**** **** ****</sub> 2562</p>
          <p class="cc-exp">Valid Thru: 12/17</p>
          <span class="remove-data">Remove</span>
        </div>
        <div class="credit-card"><div id="cc-card-logo" class="amex"></div>
          <p class="cc-num"><sub>**** **** ****</sub> 2562</p>
          <p class="cc-exp">Valid Thru: 12/17</p>
          <span class="remove-data">Remove</span>
        </div>
      </div>
    </div>
  `
});

Vue.component('app-modal', {
  template: `
    <div id="modal">
      <div id="modal_content">
        <h1>What's going on with this build?<h1>
          <h2>1. Using local browser storage to persist data.</h2>
          <h2>2. You leave/close/reload this page your data is still here.</h2>
          <h2>3. Luhn formula for credit card validation</h2>
          <h2>4. Custom calendar date picker system</h2>
          <h2>5. Automatic ledger logic for instance balance calculation</h2>

          <h1>VueJS<h1>
          <a href="#" title="Close">✖</a>
      </div>
    </div>
  `
})

var app = new Vue({ el: '#app' })
