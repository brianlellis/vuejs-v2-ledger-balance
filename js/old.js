(function(window, document, $j) {
  var Budgetizer = {},
    UserInteractions = {},
    currentDatepicker = null;

  Budgetizer.datepicker = function( query, options ) {
    if (!(this instanceof Budgetizer.datepicker)) return new Budgetizer.datepicker( query, options );

    currentDatepicker = self = this;
    self.options = extend({}, Budgetizer.datepicker.defaults, options);
    self.query = query;
    self.__init__();
  };

  Budgetizer.datepicker.prototype = {
    constructor: Budgetizer.datepicker,

    __init__: function(){
      // Bind display on click
      document.removeEventListener('click', self.bindCalendar, false);
      document.addEventListener('click', self.bindCalendar, false);
    },

    matchesReferers: function( elm ){
      self.referers = document.querySelectorAll( self.query );
      for (var i=0; i< self.referers.length; i++) {
        if (elm === self.referers[i]) return true;
      }
      return false;
    },

    close: function(){
      delete self.current;
      delete self.target;
      if (self.picker) self.picker.remove();
    },

    show: function( target ){
      self.target = typeof target != typeof undefined ? target : self.target;
      if (target || typeof self.current == typeof undefined) {
        var current = new Date();
        if (target) self.selected = null;
        if (target && target.value) {
          var ts = Date.parse( target.value.toLowerCase() );
          current = new Date( ts );
          self.selected = {
            year: current.getFullYear(),
            month: current.getMonth(),
            day: current.getDate()
          };
        }
        self.current = {
          year: current.getFullYear(),
          month: current.getMonth()
        };
      }
      self.cleanPicker();
      self.drawPicker();
    },

    cleanPicker: function(){
      var picker = document.querySelector('.vanilla-datepicker');
      if (picker) picker.remove();
    },

    drawPicker: function(){
      var position = {
        x:self.target.offsetLeft,
        y:self.target.offsetTop + self.target.offsetHeight
      };
      self.picker = document.createElement('div');
      self.picker.classList.add('vanilla-datepicker');
      self.picker.style.left = position.x + 'px';
      self.picker.style.top = position.y + 'px';
      self.picker.appendChild( self.drawNavigation() );
      self.picker.appendChild( self.drawWeekHeader() );
      var weeks = self.getWeeks();
      for (var i=0; i<weeks.length; i++) {
        self.picker.appendChild( weeks[i] );
      }

      self.target.parentNode.insertBefore( self.picker, self.target.nextSibling );
    },

    drawNavigation: function(){
      var nav = document.createElement('div');
      nav.classList.add('title-nav');

      if (self.options.navigateYear) {
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
        self.options.months.long[self.current.month] + ' ' + self.current.year
      );

      nextMonth = document.createElement('div');
      nextMonth.classList.add('month-navigate');
      nextMonth.classList.add('next');
      nextMonth.innerHTML = '>';
      //nextMonth.addEventListener('click', self.getNextMonth, false);

      if (self.options.navigateYear) nav.appendChild( previousYear );
      nav.appendChild( previousMonth );
      nav.appendChild( currentMonth );
      nav.appendChild( nextMonth );
      if (self.options.navigateYear) nav.appendChild( nextYear );

      return nav;
    },

    getPreviousYear: function() {
      var current = new Date( self.current.year -1, self.current.month);
      self.current = {
        year: current.getFullYear(),
        month: current.getMonth()
      };
      self.show();
    },

    getNextYear: function() {
      var current = new Date( self.current.year + 1, self.current.month);
      self.current = {
        year: current.getFullYear(),
        month: current.getMonth()
      };
      self.show();
    },

    getPreviousMonth: function() {
      var current = new Date( self.current.year, self.current.month - 1);
      self.current = {
        year: current.getFullYear(),
        month: current.getMonth()
      };
      self.show();
    },

    getNextMonth: function() {
      var current = new Date( self.current.year, self.current.month + 1);
      self.current = {
        year: current.getFullYear(),
        month: current.getMonth()
      };
      self.show();
    },

    drawWeekHeader: function(){
      var weekdays =  self.options.weekdays.short.slice(self.options.firstDayOfWeek)
          .concat(self.options.weekdays.short.slice(0, self.options.firstDayOfWeek)),
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
      var weekdays =  self.options.weekdays.short.slice(self.options.firstDayOfWeek)
          .concat(self.options.weekdays.short.slice(0, self.options.firstDayOfWeek)),
        // Get first day of month and update acconding to options
        firstOfMonth = new Date(self.current.year, self.current.month, 1).getDay(),
        daysInPreviousMonth = new Date(self.current.year, self.current.month, 0).getDate(),
        daysInMonth = new Date(self.current.year, self.current.month+1, 0).getDate(),
        days=[], weeks=[], day;

      firstOfMonth = firstOfMonth < self.options.firstDayOfWeek ? 7+(firstOfMonth - self.options.firstDayOfWeek ) : firstOfMonth - self.options.firstDayOfWeek;

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
          weeks.push( self.addWeek( days ) );
          days = [];
        }
        day = document.createElement('div');
        day.classList.add('day');
        if (self.selected && self.selected.year == self.current.year && self.selected.month == self.current.month && self.selected.day == i+1) {
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
        weeks.push( self.addWeek( days ) );
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
      var dayOfWeek = new Date(self.current.year, self.current.month, day).getDay(),
        date = self.options.outputFormat
          .replace('%a', self.options.weekdays.short[dayOfWeek] )
          .replace('%A', self.options.weekdays.long[dayOfWeek] )
          .replace('%d', ('0' + day).slice(-2) )
          .replace('%e', day )
          .replace('%b', self.options.months.short[self.current.month] )
          .replace('%B', self.options.months.long[self.current.month] )
          .replace('%m', ('0' + (self.current.month+1)).slice(-2) )
          .replace('%w', dayOfWeek )
          .replace('%Y', self.current.year );

      self.target.value = date;
    },

    bindCalendar: function(event) {
      var target = event.target;
      if (target.className == 'month-navigate next') {
        self.getNextMonth();
      } else if (target.className == 'month-navigate previous') {
        self.getPreviousMonth();
      } else if (target.className == 'year-navigate next') {
        self.getNextYear();
      } else if (target.className == 'year-navigate previous') {
        self.getPreviousYear();
      } else if (target.className == 'day') {
        self.setDate( target.innerHTML );
        self.close();
      } else {
        while (target && !self.matchesReferers( target ) && target.className != 'vanilla-datepicker') {
          target = target.parentNode;
        }
        if (target && self.matchesReferers( target )) self.show(target);
        if (!target) self.close();
      }
    }
  };

  Budgetizer.datepicker.defaults = {
    firstDayOfWeek: 0,
    months: {
      short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },
    navigateYear: true,
    outputFormat:'%Y-%m-%d',
    weekdays: {
      short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  };

  // utils
  var camelCase = function( string ){
    return  string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
  };

  var extend = function(out) {
    out = out || {};
    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
      }
    }

    return out;
  };

  var is = function( el, query ) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, query);
  };

  /**
   *
   * All methods relative to ledger UI section
   *
   */
  Budgetizer.Ledger = {
    /**
     * Total of all transcations in ledger
     **/
    ledgerTotal: function() {
      var txt,
        total=0.00,
        ledgeHead = $j(".ledger h2 > span");

      $j(".ledger .transactions .amount").each(function () {
        txt = parseFloat( $j(this).text().replace(/[$a-zA-Z]/g,'') );
        if ( $j(this).closest("tr").hasClass("deduction") ) txt = -Math.abs(txt);
        total+=txt;
      });

      (total < 0) ? ledgeHead.removeClass().addClass('negative-amt') : ledgeHead.removeClass();
      total = total.toString().split(".");
      if (total.length === 1) total.push("00");

      ledgeHead.html( "<span>$"+total[0]+".<sup>"+total[1].substr(0,2)+"</sup></span>" );
    },
    /**
     * Add a new transaction to ledger
     **/
    addTransaction: function () {
      $j("#ledger-add-button").click(function () {
        var amt = $j("#ledger-input .amount").val().split("."),
          co = $j("#ledger-input .company").val(),
          inv = $j("#ledger-input .invoice").val(),
          date;

        if (amt.length === 1) amt.push("00");

        $j("#balance-checker .transactions tbody").append("<tr class=\""+$j("#ledger-input .act-type").val().toLowerCase()+"\"><td class=\"icon\"><div></div></td><td class=\"name\"><p class=\"bill\">"+co+"</p><p></p><p class=\"invoice-date\">"+inv+"  - "+Budgetizer.UI.dateFormatter()+"</p></td><td class=\"amount\">$"+amt[0]+".<sup>"+amt[1]+"</sup><span class=\"remove-data\">Remove</span></td></tr>");
        $j("#ledger-input input").val("");

        Budgetizer.localData.check();
        Budgetizer.Ledger.ledgerTotal();
      });
    }
  },
    /**
     *
     * All methods relative to credit card UI section
     *
     */
    Budgetizer.CCTools = {
      /**
       * Activate dropdown form for credit card
       **/
      ccForm: function () {
        $j("#add-credit-card").click(function () {
          ( $j(this).hasClass("enabled") ) ? $j(this).removeClass("enabled") : $j(this).addClass("enabled");
          ( $j("#balance-checker .scrollme").hasClass("enabled") ) ? $j("#balance-checker .scrollme").removeClass("enabled") : $j("#balance-checker .scrollme").addClass("enabled");
          ( $j("#add-cc-form").hasClass("hidden") ) ? $j("#add-cc-form").removeClass("hidden") : $j("#add-cc-form").addClass("hidden");
        });
      },
      /**
       * Add a new credit card
       **/
      addCard: function () {
        $j("#cc-add-button").click(function () {
          var cleanDate = $j("#add-cc-form .cc-exp-month").val(),
            ccClass;
          cleanDate+= "/"+$j("#add-cc-form .cc-exp-year").val();

          if ( $j("#cc-type").hasClass("visa") ) {
            ccClass = "visa";
          } else if ( $j("#cc-type").hasClass("mc") ) {
            ccClass = "mc";
          } else if ( $j("#cc-type").hasClass("discover") ) {
            ccClass = "discover";
          } else if ( $j("#cc-type").hasClass("amex") ) {
            ccClass = "amex";
          }

          $j(".wallet .scrollme").append("<div class=\"credit-card\"><div id=\"cc-card-logo\" class=\""+ccClass+"\"></div><p class=\"cc-num\"><sub>**** **** ****</sub>"+$j("#cc-number-input").val().substr(14)+"</p><p class=\"cc-exp\">Valid Thru: "+cleanDate+"</p><span class=\"remove-data\">Remove</span></div>");

          // Clear all values
          $j('#cc-number-input').val('');
          $j(".wallet .cc-exp-month").val("01");
          $j(".wallet .cc-exp-year").val("17");
          $j("#add-cc-form").addClass("hidden");
          $j("#balance-checker .scrollme").removeClass("enabled");
          $j("#cc-type").removeClass().addClass("nothing");

          Budgetizer.localData.check();
        });
      },
      /**
       * Card type evaluator
       **/
      getCardType: function (number) {
        var re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");

        // visa
        if (number.match(/^4/) !== null) {
          $j("#cc-type").removeClass().addClass("visa");
        }
        // Mastercard
        else if (number.match(/^5[1-5]/) !== null) {
          $j("#cc-type").removeClass().addClass("mc");
        }
        // Discover
        else if (number.match(re) !== null) {
          $j("#cc-type").removeClass().addClass("discover");
        }
        // Visa Electron
        else if (number.match(re) !== null) {
          re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
          $j("#cc-type").removeClass().addClass("visa");
        }
        // Amex
        else if (number.match(/^(34|37)/) !== null) {
          $j("#cc-type").removeClass().addClass("amex");
        }
        // Card does not match criteria
        else if (number.length > 4) {
          $j("#cc-type").removeClass().addClass("nothing");
        }
      },
      /**
       * Card type input observer
       **/
      ccObserver: function () {
        $j("#cc-number-input").on("keyup", function() {
          Budgetizer.CCTools.getCardType( $j(this).val() );
          $j(this).val( Budgetizer.UI.ccFormatter( $j(this).val() ) );
        });
      }
    },
    /**
     *
     * All methods relative to general UI
     *
     */
    Budgetizer.UI = {
      /**
       * Remove data methods for their respective sections
       **/
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
      },
      /**
       * Format the date for the ledger section
       **/
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
      /**
       * Format the credit card number upon input
       **/
      ccFormatter: function (value) {
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, ''),
          matches = v.match(/\d{4,16}/g),
          match = matches && matches[0] || '',
          parts = [];

        for (i=0, len=match.length; i<len; i+=4) {
          parts.push(match.substring(i, i+4));
        }
        return (parts.length) ? parts.join(' ') : value;
      }
    };

  Budgetizer.localData = {
    check: function () {
      localStorage.clear();
      localStorage.setItem('BudgetizerCards', $j("#balance-checker .wallet .scrollme").html() );
      localStorage.setItem('BudgetizerTransactions', $j("#balance-checker .ledger .scrollme").html() );
    },
    /**
     * Local Storage On Load Method
     **/
    onLoad: function () {
      if(localStorage && localStorage.getItem('BudgetizerCards')){
        $j("#balance-checker .wallet .scrollme").html(
          localStorage.getItem('BudgetizerCards')
        );
      }
      if(localStorage && localStorage.getItem('BudgetizerTransactions')){
        $j("#balance-checker .ledger .scrollme").html(
          localStorage.getItem('BudgetizerTransactions')
        );
      }
    }
  }


  /**
   * USER INTERACTIONS AND BEHAVIORS
   **/
  UserInteractions.init = function() {
    $('div#modal').on('click','a',function(event){
      event.preventDefault();
      $('div#modal').fadeOut('slow');
      $('h1,h2,p').removeClass('blured_text');
    });
  }

  /**
   * LOAD ALL OBSERVERS AND METHODS NEEDED
   **/
  jQuery(document).ready(function () {
    Budgetizer.localData.onLoad();
    Budgetizer.datepicker( '.datepicker', { firstDayOfWeek: 1 } );
    Budgetizer.Ledger.ledgerTotal();
    Budgetizer.Ledger.addTransaction();
    Budgetizer.CCTools.ccForm();
    Budgetizer.CCTools.addCard();
    Budgetizer.CCTools.ccObserver();
    Budgetizer.UI.remove();

    UserInteractions.init();
  });
}) (window, document, jQuery);
