/* global phantom, WebPage, console_reporter */

/**
 * Runs a Jasmine Suite from an html page.
 * `page` is a PhantomJs page object.
 * `exitFunc` is the function to call in order to exit the script.
 */

var PhantomJasmineRunner, address, page, runner

PhantomJasmineRunner = (function () {
  function PhantomJasmineRunner (page, exitFunc) {
    this.page = page
    this.exitFunc = exitFunc != null ? exitFunc : phantom.exit
    this.tries = 0
    this.max_tries = 10
  }

  PhantomJasmineRunner.prototype.get_status = function () {
    return this.page.evaluate(function () {
      return console_reporter.status
    })
  }

  PhantomJasmineRunner.prototype.terminate = function () {
    switch (this.get_status()) {
      case 'success':
        return this.exitFunc(0)
      case 'fail':
        return this.exitFunc(1)
      default:
        return this.exitFunc(2)
    }
  }

  return PhantomJasmineRunner
})()

if (phantom.args.length === 0) {
  console.log('Need a url as the argument')
  phantom.exit(1)
}

page = new WebPage()

runner = new PhantomJasmineRunner(page)

page.onConsoleMessage = function (msg) {
  console.log(msg)
  if (msg === 'ConsoleReporter finished') {
    return runner.terminate()
  }
}

address = phantom.args[0]

page.open(address, function (status) {
  if (status !== 'success') {
    console.log("can't load the address!")
    return phantom.exit(1)
  }
})
