import { app, BrowserWindow, Menu, screen, Tray } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { autoUpdater } from 'electron-updater';

let win, serve, tray;
const args = process.argv.slice( 1 );
serve = args.some( val => val === '--serve' );

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow( {
    x: 0,
    y: 0,
    width: 400,
    minWidth: 300,
    maxWidth: 600,
    minHeight: 600,
    resizable: true,
    skipTaskbar: false,
    darkTheme: true,
    vibrancy: 'dark',
    titleBarStyle: 'hiddenInset',
    title: 'Simplicate Time Tracker'
  } );

  if ( serve ) {
    require( 'electron-reload' )( __dirname, {
      electron: require( `${__dirname}/node_modules/electron` )
    } );
    win.loadURL( 'http://localhost:4200' );
  } else {
    win.loadURL( url.format( {
      pathname: path.join( __dirname, 'dist/index.html' ),
      protocol: 'file:',
      slashes: true
    } ) );
  }

  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on( 'closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  } );

}

function createMenu() {
  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggledevtools' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'About',
          click() {
            require( 'electron' ).shell.openExternal( 'https://github.com/tomreinartz90/simplicate-app' );
          }
        },
        {
          label: 'Releases',
          click() {
            require( 'electron' ).shell.openExternal( 'https://github.com/tomreinartz90/simplicate-app/releases' );
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate( template );
  Menu.setApplicationMenu( menu );
}

function createTray() {
  tray = new Tray( path.join( __dirname, 'dist/assets/menubar.png' ) );
  tray.setToolTip( 'Simplicate Time Tracker' );

  tray.on( 'click', toggleWindow );
}

function toggleWindow() {
  const trayPos = tray.getBounds();
  const windowPos = win.getBounds();

  let x, y = 0;
  if ( process.platform === 'darwin' ) {
    x = Math.round( trayPos.x + (trayPos.width / 2) - (windowPos.width / 2) );
    y = Math.round( trayPos.y + trayPos.height );
  } else {
    x = Math.round( trayPos.x + (trayPos.width / 2) - (windowPos.width / 2) );
    y = Math.round( trayPos.y + trayPos.height * 10 );
  }

  win.setPosition( x, y, false );

  if ( win.isVisible() ) {
    win.hide();
  } else {
    win.show();
    win.focus();
  }
}


try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on( 'ready', () => {
    createWindow();
    createTray();
    createMenu();
    autoUpdater.checkForUpdatesAndNotify();
  } );

  // Quit when all windows are closed.
  app.on( 'window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if ( process.platform !== 'darwin' ) {
      app.quit();
    }
  } );

  app.on( 'activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if ( win === null ) {
      createWindow();
    }
  } );

} catch ( e ) {
  // Catch Error
  // throw e;
}
