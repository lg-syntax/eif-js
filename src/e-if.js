/*
 * LiveGames Embed IFrame
 * pure Javascript!
 *
 * @version: 1.2.0
 */
;(function (name, definition) {
  var LiveGames = definition()
  var hasDefine = typeof define === 'function' && define.amd
  var hasExports = typeof module !== 'undefined' && module.exports
  if (hasDefine) {
    define(LiveGames)
  } else if (hasExports) {
    module.exports = LiveGames
  } else {
    (this.jQuery || this.ender || this.$ || this)[name] = LiveGames
  }
})('LiveGames', function () {
  var base = this
  var lgCore = base.LiveGames || {
    version: '1.0.0',
    config: {
      sign: '',
      currency: 'P',
      // bgColor:'transparent'
      debug: false,
      locale: false,
      tz: false,
      origin: window.location.origin,
      fixedMaxWidth: true // @since v1.0.1
    },
    iframes: [],
    rootContainer: document.getElementById('liveGamesRoot'),
    frameQueryParams: ['sign', 'clientId', 'css', 'bgColor', 'currency', 'locale', 'tz', 'debug', 'windowName', 'origin', 'exitUrl'],
    init: function () {
      var i = 0
      var self = this
      var dataRepo = base[base.LiveGamesObject]
      self.log('[LiveGames][EIF] Initing!')

      for (i = 0; i < dataRepo.q.length; i++) {
        // self.log('[LiveGames][EIF][Config]', dataRepo.q[i])
        if (this.config[dataRepo.q[i][0]]) {
          if (this.config[dataRepo.q[i][0]] instanceof Array) {
            this.config[dataRepo.q[i][0]].concat(dataRepo.q[i][1])
          } else {
            this.config[dataRepo.q[i][0]] = dataRepo.q[i][1]
          }
        } else {
          this.config[dataRepo.q[i][0]] = dataRepo.q[i][1]
        }
      }
      dataRepo.q = []
      if (this.config.frames && this.config.frames.length) {
        for (i = 0; i < this.config.frames.length; i++) {
          if (this.config.frames[i]) {
            this.log('[LiveGames][EIF] Loading Frame (' + i + ')!')
            this.initFrame(this.config.frames[i])
          }
          try {
            this.config.frames.splice(i, 1)
          } catch (e) {}
        }
      } else {
        if (!this.liveGamesDefaultLoaded) {
          this.liveGamesDefaultLoaded = 1
          this.log('[LiveGames][EIF] Loading Default Frame!')
          this.initFrame()
        }
      }

      if (typeof (window.postMessage) !== 'undefined') {
        var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent'
        var eventer = window[eventMethod]
        var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'
        eventer(messageEvent, function (e) {
          self.catchMessage(e)
        }, false)
      } else {
        this.resize({ width: self.config.width || '100%', height: self.config.height || '1200px' })
      // TODO: low-level support
      }
      // disable all errors
      if (window && typeof (window.onerror) !== 'undefined' && (!self.config.enableErrors || !self.config.debug)) {
        window.onerror = function () { return true }
      }
      return this
    },

    log: function () {
      if (this.config.debug) { console.log.call(this, arguments) }
    },

    parseData: function (msg) {
      var res = {}
      var parts1 = msg.split('&')
      for (var i = 0; i < parts1.length; i++) {
        var part = parts1[i].split('=')
        res[part[0]] = part[1]
      }
      return res
    },

    getMaxWidth: function () {
      if (this.config.fixedMaxWidth === true) {
        return window.screen && window.screen.width ? window.screen.width + 'px' : '100%'
      }
      return this.config.fixedMaxWidth
    },
    getMaxFrameWidth: function () {
      return window.screen && window.screen.width && window.screen.width <= 1024 ? window.screen.width + 'px' : '100%'
    },
    getPosition: function (obj) {
      var x = 0
      var y = 0
      if (obj.offsetParent) {
        x = obj.offsetLeft
        y = obj.offsetTop
        while (obj = obj.offsetParent) {
          x += obj.offsetLeft
          y += obj.offsetTop
        }
      }
      return {
        left: x,
        top: y
      }
    },

    catchMessage: function (e) {
      this.log('catchMessage =>', e)
      if (e.data) {
        var data = this.parseData(e.data)
        switch (data.mType) {
          case 'goTop':
            window.scroll(0, 0)
            break
          case 'scrollTo':
            var position = {
              left: 0,
              top: 0
            }
            if (data.windowName) {
              position = this.getPosition(document.getElementById(data.windowName))
            }
            window.scroll(0, data.scrollTo - (position.top * -1))
            break
          case 'resize':
            this.resize(data)
            break
          case 'toggleFullscreen':
            if (data.windowName) {
              var frame = document.getElementById(data.windowName)
              this.toggleFullscreen(frame)
            }
            break
          default:
            this.log('catchMessage unsupported message type')
            break
        }
      } else {
        this.log('catchMessage invalid message type')
      }
    },
    isMobileAndTablet: (function (a) {
      return !!(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
    })(navigator.userAgent || navigator.vendor || window.opera),
    cancelFullScreen: function (el) {
      var requestMethod = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen
      if (requestMethod) { // cancel full screen.
        requestMethod.call(el)
      } else if (typeof window.ActiveXObject !== 'undefined') { // Older IE.
        var wscript = new ActiveXObject('WScript.Shell')
        if (wscript !== null) {
          wscript.SendKeys('{F11}')
        }
      }
    },

    requestFullScreen: function (el) {
      var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
      if (requestMethod) {
        requestMethod.call(el)
      } else if (typeof window.ActiveXObject !== 'undefined') { // Older IE.
        var wscript = new ActiveXObject('WScript.Shell')
        if (wscript !== null) {
          wscript.SendKeys('{F11}')
        }
      }
      return false
    },

    toggleFullscreen: function (elem) {
      // var elem = document.body
      var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen)
      if (isInFullScreen) {
        this.cancelFullScreen(document)
      } else {
        this.requestFullScreen(elem)
      }
      return false
    },

    resize: function (data) {
      var self = this
      if (this.isMobileAndTablet && !this.config.disableMobileResize) {
        data.height = window.innerHeight + 'px'
      }
      if (data.windowName) {
        document.getElementById(data.windowName).style.height = data.height
        document.getElementById(data.windowName).height = data.height
        if (self.config.fixedMaxWidth) {
          document.getElementById(data.windowName).style.maxWidth = self.getMaxWidth()
        }
      } else {
        for (var i = 0; i < self.iframes.length; i++) {
          if (!self.iframes[i].disableResize) {
            self.iframes[i].el.style.height = data.height
            self.iframes[i].el.height = data.height
            if (self.config.fixedMaxWidth) {
              self.iframes[i].el.style.maxWidth = self.getMaxWidth()
            }
          }
        }
      }
    },

    initFrame: function (frameConfig) {
      var frm
      var self = this
      var conf = this.extend({}, this.config, frameConfig || {})
      var rootId = conf.container || 'liveGamesRoot'
      var rootContainer = document.getElementById(rootId)
      if (!conf.windowName) {
        conf.windowName = 'lg_' + self.iframes.length
      }
      try {
        frm = document.createElement('<iframe frameborder=0 name="' + conf.windowName + '">')
      } catch (e) {
        frm = document.createElement('iframe')
        frm.name = conf.windowName
        frm.setAttribute('frameborder', '0')
      }

      frm.id = conf.windowName
      frm.setAttribute('allowFullScreen', 'true')
      frm.setAttribute('webkitallowfullscreen', 'true')
      frm.setAttribute('mozallowfullscreen', 'true')
      frm.scrolling = 'no'
      frm.src = self.createFrameSrc(conf)
      frm.width = conf.width || self.getMaxFrameWidth()
      frm.height = conf.height || '1300px'

      if (!rootContainer) {
        try {
          rootContainer = document.createElement('<div id="' + rootId + '">')
        } catch (e) {
          rootContainer = document.createElement('div')
          rootContainer.id = rootId
          rootContainer.setAttribute('id', rootId)
        }
        if (document.getElementsByTagName('body')[0]) {
          document.getElementsByTagName('body')[0].appendChild(rootContainer)
        }
      }
      self.iframes.push({
        disableResize: !!conf.disableResize,
        windowName: conf.windowName,
        el: frm
      })
      if (rootContainer) {
        rootContainer.appendChild(frm)
      }

      return rootContainer
    },

    createFrameSrc: function (conf) {
      var srcConf = [] // sets.server + sets.url_string
      if (!conf.sign) {
        this.log('Sign is required!')
        return ''
      }
      for (var i in this.frameQueryParams) {
        var confKey = this.frameQueryParams[i]
        if (conf[confKey]) srcConf.push(confKey + '=' + conf[confKey])
      }
      return (conf.protocol || window.location.protocol) + '//' + (conf.server || 'launch.livegames.io') + '/' + (conf.service || '') + '?' + srcConf.join('&')
    },

    extend: function () {
      for (var i = 1; i < arguments.length; i++) {
        for (var key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) {
            arguments[0][key] = arguments[i][key]
          }
        }
      }
      return arguments[0]
    }
  }
  return lgCore.init()
})
