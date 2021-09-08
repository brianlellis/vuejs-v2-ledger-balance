var app = new Vue({
  el:   '#app',
  data: {
    player_start:   null,
    player_turn:    null, // 1 = X : 0 = O
    player_o_wins:  0,
    player_x_wins:  0,
    games_played:   0,
    board_map:      {},
    board_length:   null
  },
  methods: {
    playerStart: function ( player_start ) {
      this.player_start = player_start;
      this.player_turn  = player_start;
    },
    playerSignature: function ( key ) {
      this.board_map[ key ] = this.player_turn;
      this.gameWinPlayer();
      this.playerTurnToggle();
    },
    playerTurnToggle: function () {
      if ( null !== this.player_turn ) this.player_turn = this.player_turn ? 0 : 1;
    },
    boardSetSize: function ( value ) {
      this.board_length = Number(value) * Number(value);
      this.boardMapCreator();
    },
    boardMapCreator: function () {
      for ( var i=0; i < this.board_length; i++ ) {
        this.board_map[i] = null;
      }
    },
    boardMapFlush: function () {
      for ( const key in this.board_map ) {
        this.board_map[ key ] = null;
      }
    },
    boardTileSignature: function ( key ) {
      if ( null !== this.board_map[ key ] ) return this.board_map[ key ] ? 'x disabled' : 'o disabled';
    },
    gameWinPlayer: function () {
      const col_modulo_var  = Math.sqrt( this.board_length );
      let tally             = 0;

      // Rows
      for ( const key in this.board_map ) {
        tally += null !== this.board_map[ key ] ? this.board_map[ key ] : 'NaN'; // null values trigger false positive

        if ( ( col_modulo_var - 1 ) === ( key % col_modulo_var ) && Number(key) > 1 ) {
          if ( 0 === tally  || col_modulo_var === tally ) this.gameWinProcess( tally );
          else tally = 0;
        }
      }

      // Columns
      let col_win_map = {};

      for ( var i=0; i < col_modulo_var; i++ ) {
        if ( undefined === col_win_map[ i ] )  col_win_map[ i ] = 0;
        for ( const key in this.board_map ) {
          if ( ( i === key % col_modulo_var ) || i === key ) {
            col_win_map[ i ] += null !== this.board_map[key] ? this.board_map[key] : 'NaN';
          }
        }
      }

      // Check map for success
      for ( const key in col_win_map ) {
        tally = col_win_map[ key ];
        if ( 0 === tally  || col_modulo_var === tally ) this.gameWinProcess( tally );
      }
      tally = 0;

      // Diagonals
      let diag_win_map = {
        main:         0,
        counter:      0,
        main_keys:    [],
        counter_keys: []
      };

      for ( var i=0; i < col_modulo_var; i++ ) {
        let key = ( col_modulo_var + 1 ) * i;
        if ( key > this.board_length ) break;

        diag_win_map.main_keys.push( key );
        diag_win_map.counter_keys.push( ( ( i + 1 ) * ( col_modulo_var - 1 ) ) );
      }

      diag_win_map.main_keys.forEach(
        key => diag_win_map.main += null !== this.board_map[ key ] ? this.board_map[ key ] : 'NaN'
      );
      diag_win_map.counter_keys.forEach(
        key => diag_win_map.counter += null !== this.board_map[ key ] ? this.board_map[ key ] : 'NaN'
      );

      tally = diag_win_map.main;
      if ( 0 === tally  || col_modulo_var === tally ) this.gameWinProcess( tally );
      else tally = 0;

      tally = diag_win_map.counter;
      if ( 0 === tally  || col_modulo_var === tally ) this.gameWinProcess( tally );
      else tally = 0;
    },
    gameWinProcess: function ( player ) {
      this.board_length = null;
      this.playerStart(null );
      this.games_played++;
      this.boardMapFlush();

      if ( player ) this.player_x_wins++;
      else this.player_o_wins++;
    }
  }
})
