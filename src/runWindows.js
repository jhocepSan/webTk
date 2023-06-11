import {Service} from 'node-windows';

var svc = new Service({
  name:'Sistema TKD Cochabamba',
  description: 'Sistema de registro y generacion de llavesy mandos de la asosiación de TEKWONDO Cochabamab_Bolivia, jjchsan dev.',
  script: './index.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();