function showWindowHref() {
  var sHref = window.location.href
  var args = sHref.split('?')
  if (args[0] == sHref) {
    return ''
  }
  var arr = args[1].split('&')
  var obj = {}
  for (var i = 0; i < arr.length; i++) {
    var arg = arr[i].split('=')
    obj[arg[0]] = arg[1]
  }
  return obj
}
let sourceFlag = showWindowHref()['sourceFlag']
if (sourceFlag === undefined || sourceFlag === '' || sourceFlag === null) {
  localStorage.setItem('sourceFlag', 'widget')
  localStorage.setItem('bridgersFlag', '')
} else {
  const urlStr = window.location.href
  const widget3 = 'bridgers'
  localStorage.setItem(
    'sourceFlag',
    sourceFlag.replace(new RegExp('#/', 'g'), ''),
  )
  if (urlStr.indexOf(widget3) !== -1) {
    localStorage.setItem('bridgersFlag', 'bridgers')
  } else {
    localStorage.setItem('bridgersFlag', '')
  }
}
let actionCode = showWindowHref()['actionCode']
if (actionCode === undefined || actionCode === '' || actionCode === null) {
  localStorage.setItem('actionCode', 'widget')
} else {
  localStorage.setItem(
    'actionCode',
    actionCode.replace(new RegExp('#/', 'g'), ''),
  )
}

let utm_source = showWindowHref()['utm_source']
if (utm_source === undefined || utm_source === '' || utm_source === null) {
  localStorage.setItem('utm_source', '')
} else {
  localStorage.setItem(
    'utm_source',
    utm_source.replace(new RegExp('#/', 'g'), ''),
  )
}