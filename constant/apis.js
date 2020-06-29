var mode = process.env.REACT_APP_MY_VAR
var API_SERVER = 'http://localhost:8090'
//var API_SERVER = 'http://www.hanhuikrkr.com:8090'

if (mode === 'development') {
  //API_SERVER = 'http://www.hanhuikrkr.com:8080'
   API_SERVER = 'http://www.hanhuikrkr.com:8090'
}

if (mode === 'production') {
  //API_SERVER = 'http://172.19.216.250:8080'
  API_SERVER = 'http://www.hanhuikrkr.com:8090'
}

export { API_SERVER }
