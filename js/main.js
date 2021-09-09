Vue.component('account-record-input', {
  data: function () {
    return {
      type:           null,
      amount:         null,
      account:        null,
      invoice:        null,
      amount_full:    null,
      amount_dollar:  null,
      amount_cents:   null,
      date:           null
    }
  },
  methods: {
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
      console.log(
        this.amount,
        this.account,
        this.invoice,
        this.amount_full,
        this.amount_dollar,
        this.amount_cents
      );

      this.amount         = null;
      this.account        = null;
      this.invoice        = null;
      this.amount_full    = null;
      this.amount_dollar  = null;
      this.amount_cents   = null;
        // Budgetizer.localData.check();
        // Budgetizer.Ledger.ledgerTotal();
    }
  },
  template: `
    <div id="ledger-input">
      <h2>Accounts Recievable Form</h2>
      <select @change="setData( 'type' , $event.target.value )">
        <option value="deduction">Deduction</option>
        <option value="addition">Addition</option>
      </select>
      <input @change="setData( 'amount' , $event.target.value )"  :value="amount_full" placeholder="Amount" />
      <input @change="setData( 'account' , $event.target.value )"  :value="account" placeholder="Company" />
      <input @change="setData( 'invoice' , $event.target.value )"  :value="invoice" placeholder="Invoice #" />
      <date-picker></date-picker>
      <button @click="persistData()">ADD</button>
    </div>
    `
});

Vue.component('date-picker', {
  data: function () {
    return {
      firstDayOfWeek: 0,
      months:         {
        short:          ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        long:           [
                          'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                          'October', 'November', 'December'
                        ]
      },
      navigateYear:   true,
      outputFormat:   '%Y-%m-%d',
      weekdays:       {
        short:          ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        long:           ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      }
    }
  },
  methods: {
    init: function( query, options ) {
      if (!(this instanceof Budgetizer.datepicker)) return new Budgetizer.datepicker( query, options );

      currentDatepicker = self = this;
      self.options = extend({}, Budgetizer.datepicker.defaults, options);
      self.query = query;
      self.__init__();
    },
    dateFormatter: function () {
      var dates = $j("#ledger-input .datepicker").val().split("-"),
        month = {
          "01" :"January", "02" :"February",
          "03" :"March", "04" :"April",
          "05" :"May", "06" :"June",
          "07" :"July", "08" :"August",
          "09" :"September", "10" :"October",
          "11" :"November", "12" :"December"
        };
      return dates[2]+" "+month[dates[1]]+", "+dates[0];
    },
    extend: function(out) {
      out = out || {};
      for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i]) continue;

        for (var key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
        }
      }

      return out;
    },
    matchesReferers: function( elm ){
      this.referers = document.querySelectorAll( this.query );
      for (var i=0; i< this.referers.length; i++) {
        if (elm === this.referers[i]) return true;
      }
      return false;
    },

    close: function(){
      delete this.current;
      delete this.target;
      if (this.picker) this.picker.remove();
    },

    show: function( target ) {
      this.target = typeof target != typeof undefined ? target : this.target;
      if (target || typeof this.current == typeof undefined) {
        var current = new Date();
        if (target) this.selected = null;
        if (target && target.value) {
          var ts = Date.parse( target.value.toLowerCase() );
          current = new Date( ts );
          this.selected = {
            year:   current.getFullYear(),
            month:  current.getMonth(),
            day:    current.getDate()
          };
        }
        this.current = {
          year:     current.getFullYear(),
          month:    current.getMonth()
        };
      }
      this.cleanPicker();
      this.drawPicker();
    },
    cleanPicker: function(){
      var picker = document.querySelector('.vanilla-datepicker');
      if (picker) picker.remove();
    },

    drawPicker: function(){
      var position = {
        x:this.target.offsetLeft,
        y:this.target.offsetTop + this.target.offsetHeight
      };
      this.picker = document.createElement('div');
      this.picker.classList.add('vanilla-datepicker');
      this.picker.style.left = position.x + 'px';
      this.picker.style.top = position.y + 'px';
      this.picker.appendChild( this.drawNavigation() );
      this.picker.appendChild( this.drawWeekHeader() );
      var weeks = this.getWeeks();
      for (var i=0; i<weeks.length; i++) {
        this.picker.appendChild( weeks[i] );
      }

      this.target.parentNode.insertBefore( this.picker, this.target.nextSibling );
    },

    drawNavigation: function(){
      var nav = document.createElement('div');
      nav.classList.add('title-nav');

      if (this.options.navigateYear) {
        previousYear = document.createElement('div');
        previousYear.classList.add('year-navigate');
        previousYear.classList.add('previous');
        previousYear.innerHTML = '<<';

        nextYear = document.createElement('div');
        nextYear.classList.add('year-navigate');
        nextYear.classList.add('next');
        nextYear.innerHTML = '>>';
      }
      previousMonth = document.createElement('div');
      previousMonth.classList.add('month-navigate');
      previousMonth.classList.add('previous');
      previousMonth.innerHTML = '<';

      currentMonth = document.createTextNode(
        this.options.months.long[this.current.month] + ' ' + this.current.year
      );

      nextMonth = document.createElement('div');
      nextMonth.classList.add('month-navigate');
      nextMonth.classList.add('next');
      nextMonth.innerHTML = '>';
      //nextMonth.addEventListener('click', this.getNextMonth, false);

      if (this.options.navigateYear) nav.appendChild( previousYear );
      nav.appendChild( previousMonth );
      nav.appendChild( currentMonth );
      nav.appendChild( nextMonth );
      if (this.options.navigateYear) nav.appendChild( nextYear );

      return nav;
    },

    getPreviousYear: function() {
      var current = new Date( this.current.year -1, this.current.month);
      this.current = {
        year: current.getFullYear(),
        month: current.getMonth()
      };
      this.show();
    },

    getNextYear: function() {
      var current = new Date( this.current.year + 1, this.current.month);
      this.current = {
        year: current.getFullYear(),
        month: current.getMonth()
      };
      this.show();
    },

    getPreviousMonth: function() {
      var current = new Date( this.current.year, this.current.month - 1);
      this.current = {
        year: current.getFullYear(),
        month: current.getMonth()
      };
      this.show();
    },

    getNextMonth: function() {
      var current = new Date( this.current.year, this.current.month + 1);
      this.current = {
        year: current.getFullYear(),
        month: current.getMonth()
      };
      this.show();
    },

    drawWeekHeader: function(){
      var weekdays =  this.options.weekdays.short.slice(this.options.firstDayOfWeek)
          .concat(this.options.weekdays.short.slice(0, this.options.firstDayOfWeek)),
        weekHeader = document.createElement('div');

      weekHeader.classList.add('week-header');
      for (var i=0; i<7; i++) {
        var dayOfWeek = document.createElement('div');
        dayOfWeek.innerHTML = weekdays[i];
        weekHeader.appendChild( dayOfWeek );
      }
      return weekHeader;
    },

    getWeeks: function(){
      var i;
      // Get week days according to options
      var weekdays =  this.options.weekdays.short.slice(this.options.firstDayOfWeek)
                        .concat(this.options.weekdays.short.slice(0, this.options.firstDayOfWeek)),
        // Get first day of month and update acconding to options
        firstOfMonth        = new Date(this.current.year, this.current.month, 1).getDay(),
        daysInPreviousMonth = new Date(this.current.year, this.current.month, 0).getDate(),
        daysInMonth         = new Date(this.current.year, this.current.month+1, 0).getDate(),
        days=[], weeks=[], day;

      firstOfMonth = firstOfMonth < this.options.firstDayOfWeek ? 7+(firstOfMonth - this.options.firstDayOfWeek ) : firstOfMonth - this.options.firstDayOfWeek;

      // Define last days of previous month if current month does not start on `firstOfMonth`
      for (i=firstOfMonth-1; i>=0; i--) {
        day = document.createElement('div');
        day.classList.add( 'no-select' );
        day.innerHTML = daysInPreviousMonth - i;
        days.push( day );
      }
      // Define days in current month
      for (i=0; i<daysInMonth; i++) {
        if (i && (firstOfMonth+i)%7 === 0) {
          weeks.push( this.addWeek( days ) );
          days = [];
        }
        day = document.createElement('div');
        day.classList.add('day');
        if (this.selected && this.selected.year == this.current.year && this.selected.month == this.current.month && this.selected.day == i+1) {
          day.classList.add('selected');
        }
        day.innerHTML = i+1;
        days.push( day );
      }
      // Define days of next month if last week is not full
      if (days.length) {
        var len = days.length;
        for (i=0; i<7-len; i++) {
          day = document.createElement('div');
          day.classList.add( 'no-select' );
          day.innerHTML = i+1;
          days.push( day );
        }
        weeks.push( this.addWeek( days ) );
      }
      return weeks;
    },

    addWeek: function( days ) {
      var week = document.createElement('div');
      week.classList.add('week');
      for (var i=0; i<days.length; i++) {
        week.appendChild( days[i] );
      }
      return week;
    },

    setDate: function( day ) {
      var dayOfWeek = new Date(this.current.year, this.current.month, day).getDay(),
        date = this.options.outputFormat
          .replace('%a', this.options.weekdays.short[dayOfWeek] )
          .replace('%A', this.options.weekdays.long[dayOfWeek] )
          .replace('%d', ('0' + day).slice(-2) )
          .replace('%e', day )
          .replace('%b', this.options.months.short[this.current.month] )
          .replace('%B', this.options.months.long[this.current.month] )
          .replace('%m', ('0' + (this.current.month+1)).slice(-2) )
          .replace('%w', dayOfWeek )
          .replace('%Y', this.current.year );

      this.target.value = date;
    },

    bindCalendar: function(event) {
      var target = event.target;
      if (target.className == 'month-navigate next') {
        this.getNextMonth();
      } else if (target.className == 'month-navigate previous') {
        this.getPreviousMonth();
      } else if (target.className == 'year-navigate next') {
        this.getNextYear();
      } else if (target.className == 'year-navigate previous') {
        this.getPreviousYear();
      } else if (target.className == 'day') {
        this.setDate( target.innerHTML );
        this.close();
      } else {
        while (target && !this.matchesReferers( target ) && target.className != 'vanilla-datepicker') {
          target = target.parentNode;
        }
        if (target && this.matchesReferers( target )) this.show(target);
        if (!target) this.close();
      }
    }
  },
  template: `
    <input type="text" class="datepicker" placeholder="Select a Date" />
  `
});

Vue.component('account-record-display', {
  data: function() {
    return {
      records: [
        {
          type:           'deduction',
          account:        'Apple iPhone 6, 6g GB',
          invoice:        'Electronics #343223',
          date:           '12 July, 2015',
          amount_dollar:   '650',
          amount_cents:    '00'
        }
      ]
    }
  },
  methods: {
    remove: function () {
      $j(document).on("click", ".transactions .remove-data", function () {
        $j(this).closest("tr").remove();
        Budgetizer.Ledger.ledgerTotal();
        Budgetizer.localData.check();
      });
      $j(document).on("click", ".wallet .remove-data", function () {
        $j(this).closest(".credit-card").remove();
        Budgetizer.Ledger.ledgerTotal();
        Budgetizer.localData.check();
      });
    }
  },
  template: `
    <tr v-for="record in records" :class="record.type">
      <td class="icon"><div></div></td>
      <td class="name">
        <p class="bill">{{record.account}}<p>
        <p class="invoice-date">{{record.invoice}}  - {{record.date}}</p>
      </td>
      <td class="amount">
        \${{record.amount_dollar}}<sup>{{record.amount_cents}}</sup><span class="remove-data">Remove</span>
      </td>
    </tr>
  `
});

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
  data: function() {
    return {
      months_abbr: [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT','OCT','NOV','DEC' ],
      current_year:     new Date().getFullYear(),
      selected_number:  null,
      selected_type:    null,
      selected_month:   1,
      selected_year:    new Date().getFullYear()
    }
  },
  methods: {
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
      if (number.match(/^4/) !== null)
        this.selected_type = "visa";
      else if (number.match(/^(4026|417500|4508|4844|491(3|7))/) !== null)
        this.selected_type = "visa";
      // Mastercard
      else if (number.match(/^5[1-5]/) !== null)
        this.selected_type = "mc";
      // Discover
      else if (number.match(/^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/) !== null)
        this.selected_type = "discover";
      // Amex
      else if (number.match(/^(34|37)/) !== null)
        this.selected_type = "amex";
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
      console.log(
        `selected_number: ${this.selected_number}`,
        `selected_type: ${this.selected_type}`,
        `selected_month: ${this.selected_month}`,
        `selected_year: ${this.selected_year}`
      );
    }
  },
  template: `
    <div class="wallet">
      <h2>My Wallet<span @click="formToggleVisibility()" id="add-credit-card">+</span></h2>
      <div id="add-cc-form" class="hidden">
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

      <credit-cards></credit-cards>
    </div>
  `
});

Vue.component('credit-cards', {
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
    }
  },
  data: function() {
    return {
      credit_cards: [
        {
          last_4:     2562,
          exp_month:  12,
          exp_year:   2021
        }
      ]
    }
  },
  template: `
    <div>
      <div v-for="credit_card in credit_cards" class="credit-card">
        <div class="cc-card-logo"></div>
        <p class="cc-num"><sub>**** **** ****</sub> {{credit_card.last_4}}</p>
        <p class="cc-exp">Valid Thru: {{credit_card.exp_month}}/{{credit_card.exp_year}}</p>
        <span class="remove-data">Remove</span>
      </div>
    </div>
  `
});

var app = new Vue({ el: '#app' })
