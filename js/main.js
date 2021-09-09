Vue.component('account-record-input', {
  data: function () {
    return this.initData();
  },
  methods: {
    initData: function () {
      return {
        type:           null,
        amount:         null,
        account:        null,
        invoice:        null,
        amount_full:    null,
        amount_dollar:  null,
        amount_cents:   null,
        invoice_record: null
      }
    },
    setData: function ( key , value ) {
      if ( 'amount' === key ) {
        const amount        = value.split(".");
        this.amount_dollar  = amount[ 0 ];
        this.amount_cents   = amount[ 1 ];
        this.amount_full    = value;
      } else {
        this[ key ] = value;
      }
    },
    persistData: function () {
      const data_obj = {
        type:           this.type,
        account:        this.account,
        invoice:        this.invoice,
        amount_full:    this.amount_full,
        amount_dollar:  this.amount_dollar,
        amount_cents:   this.amount_cents
      };

      this.$emit( 'add-invoice-record', data_obj );
      Object.assign( this.$data , this.initData() );
    }
  },
  template: `
    <div id="ledger-input">
      <h2>Accounts | Takes (-) and (+)</h2>
      <input @change="setData( 'amount' , $event.target.value )"  :value="amount_full" placeholder="Amount" />
      <input @change="setData( 'account' , $event.target.value )"  :value="account" placeholder="Company" />
      <input @change="setData( 'invoice' , $event.target.value )"  :value="invoice" placeholder="Invoice #" />
      <button @click="persistData()">ADD</button>
    </div>
    `
});

Vue.component('account-record-display', {
  props: {
    record:     Object,
    record_idx: Number
  },
  methods: {
    remove: function ( record , record_idx ) {
      this.$emit( 'remove-invoice-record' , { record:record , record_idx:record_idx } );
    }
  },
  template: `
    <tr :class="record.type">
      <td class="icon"><div></div></td>
      <td class="name">
        <p class="bill">{{record.account}}<p>
      </td>
      <td class="amount addition" v-if="record.amount_dollar > 0">
        \${{record.amount_dollar}}<sup>{{record.amount_cents}}</sup>
        <span class="remove-data" @click="remove( record, record_idx )">Remove</span>
      </td>
      <td class="amount deduction" v-else>
        (\${{Math.abs(record.amount_dollar)}}<sup>{{record.amount_cents}}</sup>)
        <span class="remove-data" @click="remove( record, record_idx )">Remove</span>
      </td>
    </tr>
  `
});

Vue.component('account-header', {
  props: {
    ledger_total_dollar:  String,
    ledger_total_cents:   String
  },
  template: `
    <h2>Current Balance
      <span>\${{ledger_total_dollar}}.<sup>{{ledger_total_cents}}</sup></span>
    </h2>
  `
});

Vue.component('stylesheets', {
  data: function() {
    return {
      parsed_sheets: this.sheets.split(',').map(value => './css/'+value+'.css')
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

Vue.component('wallet', {
  props: {
    hide_form: Boolean
  },
  data: function() {
    return this.initData();
  },
  methods: {
    initData: function () {
      return {
        months_abbr:      [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT','OCT','NOV','DEC' ],
        current_year:     new Date().getFullYear(),
        selected_number:  null,
        selected_type:    null,
        selected_month:   1,
        selected_year:    new Date().getFullYear(),
        payment_method:   {}
      }
    },
    formToggleVisibility: function () {
      const ele_toggle  = document.getElementById('add-credit-card');
      const ele_form    = document.getElementById('add-cc-form');

      ele_toggle.classList.toggle('enabled');
      ele_form.classList.toggle('hidden');
    },
    ccFormatter: function (value) {
      let v       = value.replace(/\s+/g, '').replace(/[^0-9]/gi, ''),
          matches = v.match(/\d{4,16}/g),
          match   = matches && matches[0] || '',
          parts   = [];

      for (i=0, len=match.length; i<len; i+=4) {
        parts.push(match.substring(i, i+4));
      }
      this.selected_number = parts.length ? parts.join(' ') : value;
    },
    getCardType: function (number) {
      if (number.length > 15) this.selected_number = number;
      else this.selected_number = null;

      // visa && electron
      if (
        number.match(/^4/) !== null ||
        number.match(/^(4026|417500|4508|4844|491(3|7))/) !== null
      )
        this.selected_type = 'visa';
      // Mastercard
      else if (number.match(/^5[1-5]/) !== null)
        this.selected_type = 'mc';
      // Discover
      else if (number.match(/^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/) !== null)
        this.selected_type = 'discover';
      // Amex
      else if (number.match(/^(34|37)/) !== null)
        this.selected_type = 'amex';
      // Card does not match criteria
      else if (number.length > 4)
        this.selected_type = null;
    },
    getExpMonth: function ( value ) {
      this.selected_month = Number( value );
    },
    getExpYear: function ( value ) {
      this.selected_year = Number( value );
    },
    persistCard: function () {
      const data_obj = {
        number:     this.selected_number,
        last_4:     this.selected_number.slice( -4 ),
        type:       this.selected_type,
        exp_month:  this.selected_month,
        exp_year:   this.selected_year
      };

      this.payment_method = data_obj;
      this.initData();
      this.hide_form = !this.hide_form;
    }
  },
  template: `
    <div class="wallet">
      <h2>My Wallet<span @click="formToggleVisibility()" id="add-credit-card">+</span></h2>
      <div id="add-cc-form" :class="'hidden '+hide_form">
        <input
          @keyup="ccFormatter($event.target.value)"
          @change="getCardType($event.target.value)"
          :value="selected_number"
          placeholder="Credit Card #"
          maxlength="19"
         />
        <select @change="getExpMonth($event.target.value)" class="cc-exp-month">
          <option v-for="(month , idx ) in months_abbr" :value="idx">{{month}}</option>
        </select>
        <select @change="getExpYear($event.target.value)" class="cc-exp-year">
          <option v-for="idx in 10" :value="current_year+idx">{{current_year+(idx-1)}}</option>
        </select>
        <button @click="persistCard()">ADD</button>
      </div>

      <credit-cards :payment_method="payment_method"></credit-cards>
    </div>
  `
});

Vue.component('credit-cards', {
  props: {
    payment_method: {
      type:    Object,
      default: function () {
        return {};
      }
    }
  },
  watch: {
    payment_method: function ( payment_method , old_prop ) {
      // Simple check as lodash isn't being used
      if ( payment_method.number === old_prop.number ) console.log( 'Payment Method Exists' );
      else this.credit_cards.push( payment_method );
    }
  },
  data: function() {
    return {
      credit_cards:   []
    }
  },
  methods: {
    ledgerTotal: function() {
      var txt,
        total = 0.00,
        ledgeHead = $j(".ledger h2 > span");

      $j(".ledger .transactions .amount").each(function () {
        txt = parseFloat($j(this).text().replace(/[$a-zA-Z]/g, ''));
        if ($j(this).closest("tr").hasClass("deduction")) txt = -Math.abs(txt);
        total += txt;
      });

      (total < 0) ? ledgeHead.removeClass().addClass('negative-amt') : ledgeHead.removeClass();
      total = total.toString().split(".");
      if (total.length === 1) total.push("00");

      ledgeHead.html("<span>$" + total[0] + ".<sup>" + total[1].substr(0, 2) + "</sup></span>");
    },
    removeCard: function ( index ) {
      this.credit_cards.splice( index , 1 );
    }
  },
  template: `
    <div>
      <div v-for="( credit_card , idx ) in credit_cards" class="credit-card">
        <div class="cc-card-logo"></div>
        <p class="cc-num"><sub>**** **** ****</sub> {{credit_card.last_4}}</p>
        <p class="cc-exp">Valid Thru: {{credit_card.exp_month}}/{{credit_card.exp_year}}</p>
        <span class="remove-data" @click="removeCard( idx )">Remove</span>
      </div>
    </div>
  `
});

var app = new Vue({
  el: '#app',
  data: {
    ledger_accounts:      {},
    ledger_total:         0,
    ledger_total_dollar:  0,
    ledger_total_cents:   0,
    prev_invoice:         {},
    invoice_records:      []
  },
  methods: {
    addInvoiceRecord: function ( invoice_record ) {
      if ( invoice_record.invoice === this.prev_invoice.invoice ) {
        console.log( 'Invoice Exists' );
      } else {
        this.ledger_total  += Number( invoice_record.amount_full );
        this.prev_invoice   = invoice_record;
        this.invoice_records.push( invoice_record );
        this.calcLedgerTotal();
      }
    },
    calcLedgerTotal: function () {
      let total = 0;

      this.invoice_records.forEach(value => { total  += Number( value.amount_full ); });
      const amount              = total.toString().split(".");
      this.ledger_total         = total;
      this.ledger_total_dollar  = amount[ 0 ];
      this.ledger_total_cents   = amount[ 1 ];
    },
    removeInvoiceRecord: function ( obj ) {
      console.log( obj );
      if ( obj.record.invoice === this.prev_invoice.invoice ) this.prev_invoice.invoice = {};
      this.invoice_records.splice( obj.record_index , 1 );
      this.calcLedgerTotal();
    }
  }
})
