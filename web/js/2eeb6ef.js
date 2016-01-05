/*!
 * Bootstrap v3.1.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') { throw new Error('Bootstrap\'s JavaScript requires jQuery') }

/* ========================================================================
 * Bootstrap: transition.js v3.1.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd',
      'MozTransition'    : 'transitionend',
      'OTransition'      : 'oTransitionEnd otransitionend',
      'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.1.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.1.1
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.1.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return this.sliding = false

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })
    this.$element.trigger(e)
    if (e.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid.bs.carousel', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid.bs.carousel')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.1.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') option = !option
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.1.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role=menu]' + desc + ', [role=listbox]' + desc)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).focus()
  }

  function clearMenus(e) {
    $(backdrop).remove()
    $(toggle).each(function () {
      var $parent = getParent($(this))
      var relatedTarget = { relatedTarget: this }
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu], [role=listbox]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.1.1
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.1.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return
      var that = this;

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.hoverState = null

      var complete = function() {
        that.$element.trigger('shown.bs.' + that.type)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one($.support.transition.end, complete)
          .emulateTransitionEnd(150) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element.trigger('hidden.bs.' + that.type)
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth,
      height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    clearTimeout(this.timeout)
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.1.1
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.1.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.1.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.1.1
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$window.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (this.affixed == 'top') position.top += scrollTop

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    var affixType = 'affix' + (affix ? '-' + affix : '')
    var e         = $.Event(affixType + '.bs.affix')

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

    this.$element
      .removeClass(Affix.RESET)
      .addClass(affixType)
      .trigger($.Event(affixType.replace('affix', 'affixed')))

    if (affix == 'bottom') {
      this.$element.offset({ top: scrollHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);

/******************************************************************************************************************************
COMMING SOON PAGE
*******************************************************************************************************************************/
(function($) {
    /**
    * Set your date here  (YEAR, MONTH (0 for January/11 for December), DAY, HOUR, MINUTE, SECOND)
    * according to the GMT+0 Timezone
    **/
    var launch = new Date(2015, 11, 31, 00, 00);
    /**
    * The script
    **/
    var message = $('#message');
    var days = $('#days');
    var hours = $('#hours');
    var minutes = $('#minutes');
    var seconds = $('#seconds');
    
    setDate();
    function setDate(){
        var now = new Date();
        if( launch < now ){
            days.html('<h1>0</H1><p>Day</p>');
            hours.html('<h1>0</h1><p>Hour</p>');
            minutes.html('<h1>0</h1><p>Minute</p>');
            seconds.html('<h1>0</h1><p>Second</p>');
            message.html('OUR SITE IS NOT READY YET...');
        }
        else{
            var s = -now.getTimezoneOffset()*60 + (launch.getTime() - now.getTime())/1000;
            var d = Math.floor(s/86400);
            days.html('<h1>'+d+'</h1><p>Day'+(d>1?'s':''),'</p>');
            s -= d*86400;

            var h = Math.floor(s/3600);
            hours.html('<h1>'+h+'</h1><p>Hour'+(h>1?'s':''),'</p>');
            s -= h*3600;

            var m = Math.floor(s/60);
            minutes.html('<h1>'+m+'</h1><p>Minute'+(m>1?'s':''),'</p>');

            s = Math.floor(s-m*60);
            seconds.html('<h1>'+s+'</h1><p>Second'+(s>1?'s':''),'</p>');
            setTimeout(setDate, 1000);

            message.html('THIS WINTER !');
        }
    }
})(jQuery);
/******************************************************************************************************************************
ANIMATIONS
*******************************************************************************************************************************/
(function($) {
    "use strict";
    var isMobile = false;
    if (navigator.userAgent.match(/Android/i) || 
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) || 
        navigator.userAgent.match(/iPad/i)|| 
        navigator.userAgent.match(/iPod/i) || 
        navigator.userAgent.match(/BlackBerry/i)) {                 
        isMobile = true;            
    }
    if (isMobile == true) {
        $('body').removeClass('nomobile');
        $('.animated').removeClass('animated');
    }
    $(function() {
        if (isMobile == false) {
            $('*[data-animated]').addClass('animated');
        }
        function animated_contents() {
            $(".animated:appeared").each(function (i) {
                var $this    = $(this),
                    animated = $(this).data('animated');

                setTimeout(function () {
                    $this.addClass(animated);
                }, 50 * i);
            });
        }
        animated_contents();
        $(window).scroll(function () {
            animated_contents();
        });
    });
})(jQuery);
/******************************************************************************************************************************
SLIDER
*******************************************************************************************************************************/
(function($) {
    "use strict";
    $("body.nomobile #slider").revolution(
    {
            delay:9000,
            startheight:450,
            startwidth:890,

            thumbWidth:100,
            thumbHeight:50,
            thumbAmount:5,

            onHoverStop:"on",
            hideThumbs:200,
            navigationType:"bullet",
            navigationStyle:"round",
            navigationArrows:"none",

            touchenabled:"on",

            navOffsetHorizontal:0,
            navOffsetVertical:80,
            shadow:undefined,
            fullWidth:"on",
            fullScreen:"on"
    });
})(jQuery);
/******************************************************************************************************************************
BOOTSTRAP
*******************************************************************************************************************************/
(function($) {
    "use strict";
        $('[data-rel=tooltip]').tooltip();
        $(".alert").alert();
})(jQuery);
/******************************************************************************************************************************
PROGRESS BAR
*******************************************************************************************************************************/
(function($) {
    "use strict";
    $("a.btn-progress").click(function(){
        $('#bar-container').slideToggle(); 
    });
})(jQuery);



/**************************************************************************
 * jquery.themepunch.revolution.js - jQuery Plugin for Revolution Slider
 * @version: 3.0.8 (06.08.2013)
 * @requires jQuery v1.7 or later (tested on 1.9)
 * @author ThemePunch
**************************************************************************/


/********************************************
	-	THEMEPUNCH TOOLS Ver. 1.0     -
	 Last Update of Tools 28.03.2013
*********************************************/

/*!
 * jQuery Transit - CSS3 transitions and transformations
 * Copyright(c) 2011 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

/*!
jQuery WaitForImages

Copyright (c) 2012 Alex Dickson

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.


https://github.com/alexanderdickson/waitForImages


 */

// WAIT FOR IMAGES
/*
 * waitForImages 1.4
 * -----------------
 * Provides a callback when all images have loaded in your given selector.
 * http://www.alexanderdickson.com/
 *
 *
 * Copyright (c) 2011 Alex Dickson
 * Licensed under the MIT licenses.
 * See website for more info.
 *
 */

// EASINGS

/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */
function revslider_showDoubleJqueryError(e){var t="Revolution Slider Error: You have some jquery.js library include that comes after the revolution files js include.";t+="<br> This includes make eliminates the revolution slider libraries, and make it not work.";t+="<br><br> To fix it you can:<br>    1. In the Slider Settings -> Troubleshooting set option:  <strong><b>Put JS Includes To Body</b></strong> option to true.";t+="<br>    2. Find the double jquery.js include and remove it.";t="<span style='font-size:16px;color:#BC0C06;'>"+t+"</span>";jQuery(e).show().html(t)}(function(e){function r(e){if(e in t.style)return e;var n=["Moz","Webkit","O","ms"];var r=e.charAt(0).toUpperCase()+e.substr(1);if(e in t.style){return e}for(var i=0;i<n.length;++i){var s=n[i]+r;if(s in t.style){return s}}}function i(){t.style[n.transform]="";t.style[n.transform]="rotateY(90deg)";return t.style[n.transform]!==""}function f(e){if(typeof e==="string"){this.parse(e)}return this}function l(e,t,n){if(t===true){e.queue(n)}else if(t){e.queue(t,n)}else{n()}}function c(t){var n=[];e.each(t,function(t){t=e.camelCase(t);t=e.transit.propertyMap[t]||e.cssProps[t]||t;t=d(t);if(e.inArray(t,n)===-1){n.push(t)}});return n}function h(t,n,r,i){var s=c(t);if(e.cssEase[r]){r=e.cssEase[r]}var o=""+m(n)+" "+r;if(parseInt(i,10)>0){o+=" "+m(i)}var u=[];e.each(s,function(e,t){u.push(t+" "+o)});return u.join(", ")}function p(t,r){if(!r){e.cssNumber[t]=true}e.transit.propertyMap[t]=n.transform;e.cssHooks[t]={get:function(n){var r=e(n).css("transit:transform");return r.get(t)},set:function(n,r){var i=e(n).css("transit:transform");i.setFromString(t,r);e(n).css({"transit:transform":i})}}}function d(e){return e.replace(/([A-Z])/g,function(e){return"-"+e.toLowerCase()})}function v(e,t){if(typeof e==="string"&&!e.match(/^[\-0-9\.]+$/)){return e}else{return""+e+t}}function m(t){var n=t;if(typeof n==="string"&&!n.match(/^[\-0-9\.]+/)){n=e.fx.speeds[n]||e.fx.speeds._default}return v(n,"ms")}e.transit={version:"0.9.9",propertyMap:{marginLeft:"margin",marginRight:"margin",marginBottom:"margin",marginTop:"margin",paddingLeft:"padding",paddingRight:"padding",paddingBottom:"padding",paddingTop:"padding"},enabled:true,useTransitionEnd:false};var t=document.createElement("div");var n={};var s=navigator.userAgent.toLowerCase().indexOf("chrome")>-1;n.transition=r("transition");n.transitionDelay=r("transitionDelay");n.transform=r("transform");n.transformOrigin=r("transformOrigin");n.transform3d=i();var o={transition:"transitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",msTransition:"MSTransitionEnd"};var u=n.transitionEnd=o[n.transition]||null;for(var a in n){if(n.hasOwnProperty(a)&&typeof e.support[a]==="undefined"){e.support[a]=n[a]}}t=null;e.cssEase={_default:"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeInCubic:"cubic-bezier(.55, .055, .675, .19)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};e.cssHooks["transit:transform"]={get:function(t){return e(t).data("transform")||new f},set:function(t,r){var i=r;if(!(i instanceof f)){i=new f(i)}if(n.transform==="WebkitTransform"&&!s){t.style[n.transform]=i.toString(true)}else{t.style[n.transform]=i.toString()}e(t).data("transform",i)}};e.cssHooks.transform={set:e.cssHooks["transit:transform"].set};if(e.fn.jquery<"1.8"){e.cssHooks.transformOrigin={get:function(e){return e.style[n.transformOrigin]},set:function(e,t){e.style[n.transformOrigin]=t}};e.cssHooks.transition={get:function(e){return e.style[n.transition]},set:function(e,t){e.style[n.transition]=t}}}p("scale");p("translate");p("rotate");p("rotateX");p("rotateY");p("rotate3d");p("perspective");p("skewX");p("skewY");p("x",true);p("y",true);f.prototype={setFromString:function(e,t){var n=typeof t==="string"?t.split(","):t.constructor===Array?t:[t];n.unshift(e);f.prototype.set.apply(this,n)},set:function(e){var t=Array.prototype.slice.apply(arguments,[1]);if(this.setter[e]){this.setter[e].apply(this,t)}else{this[e]=t.join(",")}},get:function(e){if(this.getter[e]){return this.getter[e].apply(this)}else{return this[e]||0}},setter:{rotate:function(e){this.rotate=v(e,"deg")},rotateX:function(e){this.rotateX=v(e,"deg")},rotateY:function(e){this.rotateY=v(e,"deg")},scale:function(e,t){if(t===undefined){t=e}this.scale=e+","+t},skewX:function(e){this.skewX=v(e,"deg")},skewY:function(e){this.skewY=v(e,"deg")},perspective:function(e){this.perspective=v(e,"px")},x:function(e){this.set("translate",e,null)},y:function(e){this.set("translate",null,e)},translate:function(e,t){if(this._translateX===undefined){this._translateX=0}if(this._translateY===undefined){this._translateY=0}if(e!==null&&e!==undefined){this._translateX=v(e,"px")}if(t!==null&&t!==undefined){this._translateY=v(t,"px")}this.translate=this._translateX+","+this._translateY}},getter:{x:function(){return this._translateX||0},y:function(){return this._translateY||0},scale:function(){var e=(this.scale||"1,1").split(",");if(e[0]){e[0]=parseFloat(e[0])}if(e[1]){e[1]=parseFloat(e[1])}return e[0]===e[1]?e[0]:e},rotate3d:function(){var e=(this.rotate3d||"0,0,0,0deg").split(",");for(var t=0;t<=3;++t){if(e[t]){e[t]=parseFloat(e[t])}}if(e[3]){e[3]=v(e[3],"deg")}return e}},parse:function(e){var t=this;e.replace(/([a-zA-Z0-9]+)\((.*?)\)/g,function(e,n,r){t.setFromString(n,r)})},toString:function(e){var t=[];for(var r in this){if(this.hasOwnProperty(r)){if(!n.transform3d&&(r==="rotateX"||r==="rotateY"||r==="perspective"||r==="transformOrigin")){continue}if(r[0]!=="_"){if(e&&r==="scale"){t.push(r+"3d("+this[r]+",1)")}else if(e&&r==="translate"){t.push(r+"3d("+this[r]+",0)")}else{t.push(r+"("+this[r]+")")}}}}return t.join(" ")}};e.fn.transition=e.fn.transit=function(t,r,i,s){var o=this;var a=0;var f=true;var c=e.extend(true,{},t);if(typeof r==="function"){s=r;r=undefined}if(typeof r==="object"){i=r.easing;a=r.delay||0;f=r.queue||true;s=r.complete;r=r.duration}if(typeof i==="function"){s=i;i=undefined}if(typeof c.easing!=="undefined"){i=c.easing;delete c.easing}if(typeof c.duration!=="undefined"){r=c.duration;delete c.duration}if(typeof c.complete!=="undefined"){s=c.complete;delete c.complete}if(typeof c.queue!=="undefined"){f=c.queue;delete c.queue}if(typeof c.delay!=="undefined"){a=c.delay;delete c.delay}if(typeof r==="undefined"){r=e.fx.speeds._default}if(typeof i==="undefined"){i=e.cssEase._default}r=m(r);var p=h(c,r,i,a);var d=e.transit.enabled&&n.transition;var v=d?parseInt(r,10)+parseInt(a,10):0;if(v===0){var g=function(e){o.css(c);if(s){s.apply(o)}if(e){e()}};l(o,f,g);return o}var y={};var b=function(r){var i=false;var a=function(){if(i){o.unbind(u,a)}if(v>0){o.each(function(){this.style[n.transition]=y[this]||null})}if(typeof s==="function"){s.apply(o)}if(typeof r==="function"){r()}};if(v>0&&u&&e.transit.useTransitionEnd){i=true;o.bind(u,a)}else{window.setTimeout(a,v)}o.each(function(){if(v>0){this.style[n.transition]=p}e(this).css(t)})};var w=function(e){this.offsetWidth;b(e)};l(o,f,w);return this};e.transit.getTransitionValue=h})(jQuery);(function(e,t){jQuery.easing["jswing"]=jQuery.easing["swing"];jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,t,n,r,i){return jQuery.easing[jQuery.easing.def](e,t,n,r,i)},easeInQuad:function(e,t,n,r,i){return r*(t/=i)*t+n},easeOutQuad:function(e,t,n,r,i){return-r*(t/=i)*(t-2)+n},easeInOutQuad:function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t+n;return-r/2*(--t*(t-2)-1)+n},easeInCubic:function(e,t,n,r,i){return r*(t/=i)*t*t+n},easeOutCubic:function(e,t,n,r,i){return r*((t=t/i-1)*t*t+1)+n},easeInOutCubic:function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t*t+n;return r/2*((t-=2)*t*t+2)+n},easeInQuart:function(e,t,n,r,i){return r*(t/=i)*t*t*t+n},easeOutQuart:function(e,t,n,r,i){return-r*((t=t/i-1)*t*t*t-1)+n},easeInOutQuart:function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t*t*t+n;return-r/2*((t-=2)*t*t*t-2)+n},easeInQuint:function(e,t,n,r,i){return r*(t/=i)*t*t*t*t+n},easeOutQuint:function(e,t,n,r,i){return r*((t=t/i-1)*t*t*t*t+1)+n},easeInOutQuint:function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t*t*t*t+n;return r/2*((t-=2)*t*t*t*t+2)+n},easeInSine:function(e,t,n,r,i){return-r*Math.cos(t/i*(Math.PI/2))+r+n},easeOutSine:function(e,t,n,r,i){return r*Math.sin(t/i*(Math.PI/2))+n},easeInOutSine:function(e,t,n,r,i){return-r/2*(Math.cos(Math.PI*t/i)-1)+n},easeInExpo:function(e,t,n,r,i){return t==0?n:r*Math.pow(2,10*(t/i-1))+n},easeOutExpo:function(e,t,n,r,i){return t==i?n+r:r*(-Math.pow(2,-10*t/i)+1)+n},easeInOutExpo:function(e,t,n,r,i){if(t==0)return n;if(t==i)return n+r;if((t/=i/2)<1)return r/2*Math.pow(2,10*(t-1))+n;return r/2*(-Math.pow(2,-10*--t)+2)+n},easeInCirc:function(e,t,n,r,i){return-r*(Math.sqrt(1-(t/=i)*t)-1)+n},easeOutCirc:function(e,t,n,r,i){return r*Math.sqrt(1-(t=t/i-1)*t)+n},easeInOutCirc:function(e,t,n,r,i){if((t/=i/2)<1)return-r/2*(Math.sqrt(1-t*t)-1)+n;return r/2*(Math.sqrt(1-(t-=2)*t)+1)+n},easeInElastic:function(e,t,n,r,i){var s=1.70158;var o=0;var u=r;if(t==0)return n;if((t/=i)==1)return n+r;if(!o)o=i*.3;if(u<Math.abs(r)){u=r;var s=o/4}else var s=o/(2*Math.PI)*Math.asin(r/u);return-(u*Math.pow(2,10*(t-=1))*Math.sin((t*i-s)*2*Math.PI/o))+n},easeOutElastic:function(e,t,n,r,i){var s=1.70158;var o=0;var u=r;if(t==0)return n;if((t/=i)==1)return n+r;if(!o)o=i*.3;if(u<Math.abs(r)){u=r;var s=o/4}else var s=o/(2*Math.PI)*Math.asin(r/u);return u*Math.pow(2,-10*t)*Math.sin((t*i-s)*2*Math.PI/o)+r+n},easeInOutElastic:function(e,t,n,r,i){var s=1.70158;var o=0;var u=r;if(t==0)return n;if((t/=i/2)==2)return n+r;if(!o)o=i*.3*1.5;if(u<Math.abs(r)){u=r;var s=o/4}else var s=o/(2*Math.PI)*Math.asin(r/u);if(t<1)return-.5*u*Math.pow(2,10*(t-=1))*Math.sin((t*i-s)*2*Math.PI/o)+n;return u*Math.pow(2,-10*(t-=1))*Math.sin((t*i-s)*2*Math.PI/o)*.5+r+n},easeInBack:function(e,t,n,r,i,s){if(s==undefined)s=1.70158;return r*(t/=i)*t*((s+1)*t-s)+n},easeOutBack:function(e,t,n,r,i,s){if(s==undefined)s=1.70158;return r*((t=t/i-1)*t*((s+1)*t+s)+1)+n},easeInOutBack:function(e,t,n,r,i,s){if(s==undefined)s=1.70158;if((t/=i/2)<1)return r/2*t*t*(((s*=1.525)+1)*t-s)+n;return r/2*((t-=2)*t*(((s*=1.525)+1)*t+s)+2)+n},easeInBounce:function(e,t,n,r,i){return r-jQuery.easing.easeOutBounce(e,i-t,0,r,i)+n},easeOutBounce:function(e,t,n,r,i){if((t/=i)<1/2.75){return r*7.5625*t*t+n}else if(t<2/2.75){return r*(7.5625*(t-=1.5/2.75)*t+.75)+n}else if(t<2.5/2.75){return r*(7.5625*(t-=2.25/2.75)*t+.9375)+n}else{return r*(7.5625*(t-=2.625/2.75)*t+.984375)+n}},easeInOutBounce:function(e,t,n,r,i){if(t<i/2)return jQuery.easing.easeInBounce(e,t*2,0,r,i)*.5+n;return jQuery.easing.easeOutBounce(e,t*2-i,0,r,i)*.5+r*.5+n}});e.waitForImages={hasImageProperties:["backgroundImage","listStyleImage","borderImage","borderCornerImage"]};e.expr[":"].uncached=function(t){var n=document.createElement("img");n.src=t.src;return e(t).is('img[src!=""]')&&!n.complete};e.fn.waitForImages=function(t,n,r){if(e.isPlainObject(arguments[0])){n=t.each;r=t.waitForAll;t=t.finished}t=t||e.noop;n=n||e.noop;r=!!r;if(!e.isFunction(t)||!e.isFunction(n)){throw new TypeError("An invalid callback was supplied.")}return this.each(function(){var i=e(this),s=[];if(r){var o=e.waitForImages.hasImageProperties||[],u=/url\((['"]?)(.*?)\1\)/g;i.find("*").each(function(){var t=e(this);if(t.is("img:uncached")){s.push({src:t.attr("src"),element:t[0]})}e.each(o,function(e,n){var r=t.css(n);if(!r){return true}var i;while(i=u.exec(r)){s.push({src:i[2],element:t[0]})}})})}else{i.find("img:uncached").each(function(){s.push({src:this.src,element:this})})}var a=s.length,f=0;if(a==0){t.call(i[0])}e.each(s,function(r,s){var o=new Image;e(o).bind("load error",function(e){f++;n.call(s.element,f,a,e.type=="load");if(f==a){t.call(i[0]);return false}});o.src=s.src})})};e.fn.swipe=function(t){if(!this)return false;var n={fingers:1,threshold:75,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,click:null,triggerOnTouchEnd:true,allowPageScroll:"auto"};var r="left";var i="right";var s="up";var o="down";var u="none";var a="horizontal";var f="vertical";var l="auto";var c="start";var h="move";var p="end";var d="cancel";var v="ontouchstart"in window,m=v?"touchstart":"mousedown",g=v?"touchmove":"mousemove",y=v?"touchend":"mouseup",b="touchcancel";var w="start";if(t.allowPageScroll==undefined&&(t.swipe!=undefined||t.swipeStatus!=undefined))t.allowPageScroll=u;if(t)e.extend(n,t);return this.each(function(){function t(){var e=S();if(e<=45&&e>=0)return r;else if(e<=360&&e>=315)return r;else if(e>=135&&e<=225)return i;else if(e>45&&e<135)return o;else return s}function S(){var e=P.x-H.x;var t=H.y-P.y;var n=Math.atan2(t,e);var r=Math.round(n*180/Math.PI);if(r<0)r=360-Math.abs(r);return r}function x(){return Math.round(Math.sqrt(Math.pow(H.x-P.x,2)+Math.pow(H.y-P.y,2)))}function T(e,t){if(n.allowPageScroll==u){e.preventDefault()}else{var c=n.allowPageScroll==l;switch(t){case r:if(n.swipeLeft&&c||!c&&n.allowPageScroll!=a)e.preventDefault();break;case i:if(n.swipeRight&&c||!c&&n.allowPageScroll!=a)e.preventDefault();break;case s:if(n.swipeUp&&c||!c&&n.allowPageScroll!=f)e.preventDefault();break;case o:if(n.swipeDown&&c||!c&&n.allowPageScroll!=f)e.preventDefault();break}}}function N(e,t){if(n.swipeStatus)n.swipeStatus.call(M,e,t,direction||null,distance||0);if(t==d){if(n.click&&(D==1||!v)&&(isNaN(distance)||distance==0))n.click.call(M,e,e.target)}if(t==p){if(n.swipe){n.swipe.call(M,e,direction,distance)}switch(direction){case r:if(n.swipeLeft)n.swipeLeft.call(M,e,direction,distance);break;case i:if(n.swipeRight)n.swipeRight.call(M,e,direction,distance);break;case s:if(n.swipeUp)n.swipeUp.call(M,e,direction,distance);break;case o:if(n.swipeDown)n.swipeDown.call(M,e,direction,distance);break}}}function C(e){D=0;P.x=0;P.y=0;H.x=0;H.y=0;B.x=0;B.y=0}function k(e){e.preventDefault();distance=x();direction=t();if(n.triggerOnTouchEnd){w=p;if((D==n.fingers||!v)&&H.x!=0){if(distance>=n.threshold){N(e,w);C(e)}else{w=d;N(e,w);C(e)}}else{w=d;N(e,w);C(e)}}else if(w==h){w=d;N(e,w);C(e)}O.removeEventListener(g,L,false);O.removeEventListener(y,k,false)}function L(e){if(w==p||w==d)return;var r=v?e.touches[0]:e;H.x=r.pageX;H.y=r.pageY;direction=t();if(v){D=e.touches.length}w=h;T(e,direction);if(D==n.fingers||!v){distance=x();if(n.swipeStatus)N(e,w,direction,distance);if(!n.triggerOnTouchEnd){if(distance>=n.threshold){w=p;N(e,w);C(e)}}}else{w=d;N(e,w);C(e)}}function A(e){var t=v?e.touches[0]:e;w=c;if(v){D=e.touches.length}distance=0;direction=null;if(D==n.fingers||!v){P.x=H.x=t.pageX;P.y=H.y=t.pageY;if(n.swipeStatus)N(e,w)}else{C(e)}O.addEventListener(g,L,false);O.addEventListener(y,k,false)}var O=this;var M=e(this);var _=null;var D=0;var P={x:0,y:0};var H={x:0,y:0};var B={x:0,y:0};try{this.addEventListener(m,A,false);this.addEventListener(b,C)}catch(j){}})}})(jQuery);(function(e,t){function n(e){var t=[],n;var r=window.location.href.slice(window.location.href.indexOf(e)+1).split("_");for(var i=0;i<r.length;i++){r[i]=r[i].replace("%3D","=");n=r[i].split("=");t.push(n[0]);t[n[0]]=n[1]}return t}function r(n,r){n.find(".defaultimg").each(function(i){var s=e(this);if(s.data("lazyload")!=t&&s.data("lazydone")==1||s.data("lazyload")===t)g(s,r);r.height=Math.round(r.startheight*(r.width/r.startwidth));n.height(r.height);if(s.data("lazyload")!=t&&s.data("lazydone")==1||s.data("lazyload")===t)g(s,r);try{n.parent().find(".tp-bannershadow").css({width:r.width})}catch(u){}var a=n.find(">ul >li:eq("+r.act+") .slotholder");var f=n.find(">ul >li:eq("+r.next+") .slotholder");S(n,r);f.find(".defaultimg").css({opacity:0});a.find(".defaultimg").css({opacity:1});x(n,r);var l=n.find(">ul >li:eq("+r.next+")");n.find(".tp-caption").each(function(){e(this).stop(true,true)});D(l,r);o(r,n)})}function s(){var e=["android","webos","iphone","ipad","blackberry","Android","webos",,"iPod","iPhone","iPad","Blackberry","BlackBerry"];var t=false;for(i in e){if(navigator.userAgent.split(e[i]).length>1){t=true}}return t}function o(e,t){e.cd=0;if(e.videoplaying!=true){var n=t.find(".tp-bannertimer");if(n.length>0){n.stop();n.css({width:"0%"});n.animate({width:"100%"},{duration:e.delay-100,queue:false,easing:"linear"})}clearTimeout(e.thumbtimer);e.thumbtimer=setTimeout(function(){l(t);m(t,e)},200)}}function u(e,t){e.cd=0;var n=t.find(".tp-bannertimer");if(n.length>0){n.stop(true,true);n.css({width:"0%"})}clearTimeout(e.thumbtimer)}function a(e,t){e.cd=0;T(t,e);var n=t.find(".tp-bannertimer");if(n.length>0){n.stop();n.css({width:"0%"});n.animate({width:"100%"},{duration:e.delay-100,queue:false,easing:"linear"})}}function f(n,r){var i=n.parent();if(r.navigationType=="thumb"||r.navsecond=="both"){i.append('<div class="tp-bullets tp-thumbs '+r.navigationStyle+'"><div class="tp-mask"><div class="tp-thumbcontainer"></div></div></div>')}var s=i.find(".tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer");var o=s.parent();o.width(r.thumbWidth*r.thumbAmount);o.height(r.thumbHeight);o.parent().width(r.thumbWidth*r.thumbAmount);o.parent().height(r.thumbHeight);n.find(">ul:first >li").each(function(e){var r=n.find(">ul:first >li:eq("+e+")");if(r.data("thumb")!=t)var i=r.data("thumb");else var i=r.find("img:first").attr("src");s.append('<div class="bullet thumb"><img src="'+i+'"></div>');var o=s.find(".bullet:first")});var u=100;s.find(".bullet").each(function(t){var i=e(this);if(t==r.slideamount-1)i.addClass("last");if(t==0)i.addClass("first");i.width(r.thumbWidth);i.height(r.thumbHeight);if(u>i.outerWidth(true))u=i.outerWidth(true);i.click(function(){if(r.transition==0&&i.index()!=r.act){r.next=i.index();a(r,n)}})});var f=u*n.find(">ul:first >li").length;var h=s.parent().width();r.thumbWidth=u;if(h<f){e(document).mousemove(function(t){e("body").data("mousex",t.pageX)});s.parent().mouseenter(function(){var t=e(this);t.addClass("over");var r=t.offset();var i=e("body").data("mousex")-r.left;var s=t.width();var o=t.find(".bullet:first").outerWidth(true);var u=o*n.find(">ul:first >li").length;var a=u-s+15;var f=a/s;i=i-30;var l=0-i*f;if(l>0)l=0;if(l<0-u+s)l=0-u+s;c(t,l,200)});s.parent().mousemove(function(){var t=e(this);var r=t.offset();var i=e("body").data("mousex")-r.left;var s=t.width();var o=t.find(".bullet:first").outerWidth(true);var u=o*n.find(">ul:first >li").length;var a=u-s+15;var f=a/s;i=i-30;var l=0-i*f;if(l>0)l=0;if(l<0-u+s)l=0-u+s;c(t,l,0)});s.parent().mouseleave(function(){var t=e(this);t.removeClass("over");l(n)})}}function l(e){var t=e.parent().find(".tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer");var n=t.parent();var r=n.offset();var i=n.find(".bullet:first").outerWidth(true);var s=n.find(".bullet.selected").index()*i;var o=n.width();var i=n.find(".bullet:first").outerWidth(true);var u=i*e.find(">ul:first >li").length;var a=u-o;var f=a/o;var l=0-s;if(l>0)l=0;if(l<0-u+o)l=0-u+o;if(!n.hasClass("over")){c(n,l,200)}}function c(e,t,n){e.stop();e.find(".tp-thumbcontainer").animate({left:t+"px"},{duration:n,queue:false})}function h(t,n){if(n.navigationType=="bullet"||n.navigationType=="both"){t.parent().append('<div class="tp-bullets simplebullets '+n.navigationStyle+'"></div>')}var r=t.parent().find(".tp-bullets");t.find(">ul:first >li").each(function(e){var n=t.find(">ul:first >li:eq("+e+") img:first").attr("src");r.append('<div class="bullet"></div>');var i=r.find(".bullet:first")});r.find(".bullet").each(function(r){var i=e(this);if(r==n.slideamount-1)i.addClass("last");if(r==0)i.addClass("first");i.click(function(){var e=false;if(n.navigationArrows=="withbullet"||n.navigationArrows=="nexttobullets"){if(i.index()-1==n.act)e=true}else{if(i.index()==n.act)e=true}if(n.transition==0&&!e){if(n.navigationArrows=="withbullet"||n.navigationArrows=="nexttobullets"){n.next=i.index()-1}else{n.next=i.index()}a(n,t)}})});r.append('<div class="tpclear"></div>');m(t,n)}function p(e,n){var r=e.find(".tp-bullets");var i="";var s=n.navigationStyle;if(n.navigationArrows=="none")i="visibility:none";n.soloArrowStyle="default";if(n.navigationArrows!="none"&&n.navigationArrows!="nexttobullets")s=n.soloArrowStyle;e.parent().append('<div style="'+i+'" class="tp-leftarrow tparrows '+s+'"></div>');e.parent().append('<div style="'+i+'" class="tp-rightarrow tparrows '+s+'"></div>');e.parent().find(".tp-rightarrow").click(function(){if(n.transition==0){if(e.data("showus")!=t&&e.data("showus")!=-1)n.next=e.data("showus")-1;else n.next=n.next+1;e.data("showus",-1);if(n.next>=n.slideamount)n.next=0;if(n.next<0)n.next=0;if(n.act!=n.next)a(n,e)}});e.parent().find(".tp-leftarrow").click(function(){if(n.transition==0){n.next=n.next-1;n.leftarrowpressed=1;if(n.next<0)n.next=n.slideamount-1;a(n,e)}});m(e,n)}function d(e,t){if(t.touchenabled=="on")e.swipe({data:e,swipeRight:function(){if(t.transition==0){t.next=t.next-1;t.leftarrowpressed=1;if(t.next<0)t.next=t.slideamount-1;a(t,e)}},swipeLeft:function(){if(t.transition==0){t.next=t.next+1;if(t.next==t.slideamount)t.next=0;a(t,e)}},allowPageScroll:"auto"})}function v(e,t){var n=e.parent().find(".tp-bullets");var r=e.parent().find(".tparrows");if(n==null){e.append('<div class=".tp-bullets"></div>');var n=e.parent().find(".tp-bullets")}if(r==null){e.append('<div class=".tparrows"></div>');var r=e.parent().find(".tparrows")}e.data("hidethumbs",t.hideThumbs);n.addClass("hidebullets");r.addClass("hidearrows");n.hover(function(){n.addClass("hovered");clearTimeout(e.data("hidethumbs"));n.removeClass("hidebullets");r.removeClass("hidearrows")},function(){n.removeClass("hovered");if(!e.hasClass("hovered")&&!n.hasClass("hovered"))e.data("hidethumbs",setTimeout(function(){n.addClass("hidebullets");r.addClass("hidearrows")},t.hideThumbs))});r.hover(function(){n.addClass("hovered");clearTimeout(e.data("hidethumbs"));n.removeClass("hidebullets");r.removeClass("hidearrows")},function(){n.removeClass("hovered")});e.on("mouseenter",function(){e.addClass("hovered");clearTimeout(e.data("hidethumbs"));n.removeClass("hidebullets");r.removeClass("hidearrows")});e.on("mouseleave",function(){e.removeClass("hovered");if(!e.hasClass("hovered")&&!n.hasClass("hovered"))e.data("hidethumbs",setTimeout(function(){n.addClass("hidebullets");r.addClass("hidearrows")},t.hideThumbs))})}function m(e,t){var n=e.parent();var r=n.find(".tp-bullets");var i=n.find(".tp-leftarrow");var s=n.find(".tp-rightarrow");if(t.navigationType=="thumb"&&t.navigationArrows=="nexttobullets")t.navigationArrows="solo";if(t.navigationArrows=="nexttobullets"){i.prependTo(r).css({"float":"left"});s.insertBefore(r.find(".tpclear")).css({"float":"left"})}if(t.navigationArrows!="none"&&t.navigationArrows!="nexttobullets"){i.css({position:"absolute"});s.css({position:"absolute"});if(t.soloArrowLeftValign=="center")i.css({top:"50%",marginTop:t.soloArrowLeftVOffset-Math.round(i.innerHeight()/2)+"px"});if(t.soloArrowLeftValign=="bottom")i.css({top:"auto",bottom:0+t.soloArrowLeftVOffset+"px"});if(t.soloArrowLeftValign=="top")i.css({bottom:"auto",top:0+t.soloArrowLeftVOffset+"px"});if(t.soloArrowLeftHalign=="center")i.css({left:"50%",marginLeft:t.soloArrowLeftHOffset-Math.round(i.innerWidth()/2)+"px"});if(t.soloArrowLeftHalign=="left")i.css({left:0+t.soloArrowLeftHOffset+"px"});if(t.soloArrowLeftHalign=="right")i.css({right:0+t.soloArrowLeftHOffset+"px"});if(t.soloArrowRightValign=="center")s.css({top:"50%",marginTop:t.soloArrowRightVOffset-Math.round(s.innerHeight()/2)+"px"});if(t.soloArrowRightValign=="bottom")s.css({top:"auto",bottom:0+t.soloArrowRightVOffset+"px"});if(t.soloArrowRightValign=="top")s.css({bottom:"auto",top:0+t.soloArrowRightVOffset+"px"});if(t.soloArrowRightHalign=="center")s.css({left:"50%",marginLeft:t.soloArrowRightHOffset-Math.round(s.innerWidth()/2)+"px"});if(t.soloArrowRightHalign=="left")s.css({left:0+t.soloArrowRightHOffset+"px"});if(t.soloArrowRightHalign=="right")s.css({right:0+t.soloArrowRightHOffset+"px"});if(i.position()!=null)i.css({top:Math.round(parseInt(i.position().top,0))+"px"});if(s.position()!=null)s.css({top:Math.round(parseInt(s.position().top,0))+"px"})}if(t.navigationArrows=="none"){i.css({visibility:"hidden"});s.css({visibility:"hidden"})}if(t.navigationVAlign=="center")r.css({top:"50%",marginTop:t.navigationVOffset-Math.round(r.innerHeight()/2)+"px"});if(t.navigationVAlign=="bottom")r.css({bottom:0+t.navigationVOffset+"px"});if(t.navigationVAlign=="top")r.css({top:0+t.navigationVOffset+"px"});if(t.navigationHAlign=="center")r.css({left:"50%",marginLeft:t.navigationHOffset-Math.round(r.innerWidth()/2)+"px"});if(t.navigationHAlign=="left")r.css({left:0+t.navigationHOffset+"px"});if(t.navigationHAlign=="right")r.css({right:0+t.navigationHOffset+"px"})}function g(n,r){r.width=parseInt(r.container.width(),0);r.height=parseInt(r.container.height(),0);r.bw=r.width/r.startwidth;if(r.fullScreen=="on"){r.height=r.bw*r.startheight}r.bh=r.height/r.startheight;if(r.bh>1){r.bh=1;r.bw=1}if(n.data("lazyload")!=t&&n.data("lazydone")==1||n.data("lazyload")===t){if(n.data("orgw")!=t&&n.data("orgw")!=0){n.width(n.data("orgw"));n.height(n.data("orgh"))}}var i=r.width/n.width();var s=r.height/n.height();r.fw=i;r.fh=s;if(n.data("lazyload")!=t&&n.data("lazydone")==1||n.data("lazyload")===t){if(n.data("orgw")==t||n.data("orgw")==0){n.data("orgw",n.width());n.data("orgh",n.height())}}if(r.fullWidth=="on"&&r.fullScreen!="on"){var o=r.container.parent().width();var u=r.container.parent().height();var a=u/n.data("orgh");var f=o/n.data("orgw");if(n.data("lazyload")!=t&&n.data("lazydone")==1||n.data("lazyload")===t){n.width(n.width()*a);n.height(u)}if(n.width()<o){n.width(o+50);var f=n.width()/n.data("orgw");n.height(n.data("orgh")*f)}if(n.width()>o){n.data("fxof",o/2-n.width()/2);n.css({position:"absolute",left:n.data("fxof")+"px"})}if(n.height()<=u){n.data("fyof",0);n.data("fxof",o/2-n.width()/2);n.css({position:"absolute",top:n.data("fyof")+"px",left:n.data("fxof")+"px"})}if(n.height()>u&&n.data("fullwidthcentering")=="on"){n.data("fyof",u/2-n.height()/2);n.data("fxof",o/2-n.width()/2);n.css({position:"absolute",top:n.data("fyof")+"px",left:n.data("fxof")+"px"})}}else if(r.fullScreen=="on"){var o=r.container.parent().width();var u=e(window).height();var l=u/2-r.startheight*r.bh/2;if(l<0)u=r.startheight*r.bh;if(r.fullScreenOffsetContainer!=t){try{u=u-e(r.fullScreenOffsetContainer).outerHeight(true)}catch(c){}}r.container.parent().height(u);r.container.css({height:"100%"});r.height=u;var a=u/n.data("orgh");var f=o/n.data("orgw");if(n.data("lazyload")!=t&&n.data("lazydone")==1||n.data("lazyload")===t){n.width(n.width()*a);n.height(u)}if(n.width()<o){n.width(o+50);var f=n.width()/n.data("orgw");n.height(n.data("orgh")*f)}if(n.width()>o){n.data("fxof",o/2-n.width()/2);n.css({position:"absolute",left:n.data("fxof")+"px"})}if(n.height()<=u){n.data("fyof",0);n.data("fxof",o/2-n.width()/2);n.css({position:"absolute",top:n.data("fyof")+"px",left:n.data("fxof")+"px"})}if(n.height()>u&&n.data("fullwidthcentering")=="on"){n.data("fyof",u/2-n.height()/2);n.data("fxof",o/2-n.width()/2);n.css({position:"absolute",top:n.data("fyof")+"px",left:n.data("fxof")+"px"})}}else{if(n.data("lazyload")!=t&&n.data("lazydone")==1||n.data("lazyload")===t){n.width(r.width);n.height(n.height()*i)}if(n.height()<r.height&&n.height()!=0&&n.height()!=null){if(n.data("lazyload")!=t&&n.data("lazydone")==1||n.data("lazyload")===t){n.height(r.height);n.width(n.data("orgw")*s)}}}if(n.data("lazyload")!=t&&n.data("lazydone")==1||n.data("lazyload")===t){n.data("neww",n.width());n.data("newh",n.height())}if(r.fullWidth=="on"){r.slotw=Math.ceil(n.width()/r.slots)}else{r.slotw=Math.ceil(r.width/r.slots)}if(r.fullSreen=="on")r.sloth=Math.ceil(e(window).height()/r.slots);else r.sloth=Math.ceil(r.height/r.slots)}function y(n,r){n.find(".tp-caption").each(function(){e(this).addClass(e(this).data("transition"));e(this).addClass("start")});n.find(">ul:first").css({overflow:"hidden",width:"100%",height:"100%",maxHeight:n.parent().css("maxHeight")});n.find(">ul:first >li").each(function(n){var r=e(this);r.css({width:"100%",height:"100%",overflow:"hidden"});if(r.data("link")!=t){var i=r.data("link");var s="_self";var o=2;if(r.data("slideindex")=="back")o=0;var u=r.data("linktoslide");if(r.data("target")!=t)s=r.data("target");if(i=="slide"){r.append('<div class="tp-caption sft slidelink" style="z-index:'+o+';" data-x="0" data-y="0" data-linktoslide="'+u+'" data-start="0"><a><div></div></a></div>')}else{u="no";r.append('<div class="tp-caption sft slidelink" style="z-index:'+o+';" data-x="0" data-y="0" data-linktoslide="'+u+'" data-start="0"><a target="'+s+'" href="'+i+'"><div></div></a></div>')}}});n.parent().css({overflow:"visible"});n.find(">ul:first >li >img").each(function(n){var i=e(this);i.addClass("defaultimg");if(i.data("lazyload")!=t&&i.data("lazydone")!=1){}else{g(i,r);g(i,r)}i.wrap('<div class="slotholder"></div>');i.css({opacity:0});i.data("li-id",n)})}function b(e,n,r){var i=e;var s=i.find("img");g(s,n);var o=s.attr("src");var u=s.css("background-color");var a=s.data("neww");var f=s.data("newh");var l=s.data("fxof");if(l==t)l=0;var c=s.data("fyof");if(s.data("fullwidthcentering")!="on"||c==t)c=0;var h=0;if(!r)var h=0-n.slotw;for(var p=0;p<n.slots;p++)i.append('<div class="slot" style="position:absolute;top:'+(0+c)+"px;left:"+(l+p*n.slotw)+"px;overflow:hidden;width:"+n.slotw+"px;height:"+f+'px"><div class="slotslide" style="position:absolute;top:0px;left:'+h+"px;width:"+n.slotw+"px;height:"+f+'px;overflow:hidden;"><img style="background-color:'+u+";position:absolute;top:0px;left:"+(0-p*n.slotw)+"px;width:"+a+"px;height:"+f+'px" src="'+o+'"></div></div>')}function w(e,n,r){var i=e;var s=i.find("img");g(s,n);var o=s.attr("src");var u=s.css("background-color");var a=s.data("neww");var f=s.data("newh");var l=s.data("fxof");if(l==t)l=0;var c=s.data("fyof");if(s.data("fullwidthcentering")!="on"||c==t)c=0;var h=0;if(!r)var h=0-n.sloth;for(var p=0;p<n.slots+2;p++)i.append('<div class="slot" style="position:absolute;'+"top:"+(c+p*n.sloth)+"px;"+"left:"+l+"px;"+"overflow:hidden;"+"width:"+a+"px;"+"height:"+n.sloth+'px"'+'><div class="slotslide" style="position:absolute;'+"top:"+h+"px;"+"left:0px;width:"+a+"px;"+"height:"+n.sloth+"px;"+'overflow:hidden;"><img style="position:absolute;'+"background-color:"+u+";"+"top:"+(0-p*n.sloth)+"px;"+"left:0px;width:"+a+"px;"+"height:"+f+'px" src="'+o+'"></div></div>')}function E(e,n,r){var i=e;var s=i.find("img");g(s,n);var o=s.attr("src");var u=s.css("background-color");var a=s.data("neww");var f=s.data("newh");var l=s.data("fxof");if(l==t)l=0;var c=s.data("fyof");if(s.data("fullwidthcentering")!="on"||c==t)c=0;var h=0;var p=0;if(n.sloth>n.slotw)p=n.sloth;else p=n.slotw;if(!r){var h=0-p}n.slotw=p;n.sloth=p;var d=0;var v=0;for(var m=0;m<n.slots;m++){v=0;for(var y=0;y<n.slots;y++){i.append('<div class="slot" '+'style="position:absolute;'+"top:"+(c+v)+"px;"+"left:"+(l+d)+"px;"+"width:"+p+"px;"+"height:"+p+"px;"+'overflow:hidden;">'+'<div class="slotslide" data-x="'+d+'" data-y="'+v+'" '+'style="position:absolute;'+"top:"+0+"px;"+"left:"+0+"px;"+"width:"+p+"px;"+"height:"+p+"px;"+'overflow:hidden;">'+'<img style="position:absolute;'+"top:"+(0-v)+"px;"+"left:"+(0-d)+"px;"+"width:"+a+"px;"+"height:"+f+"px"+"background-color:"+u+';"'+'src="'+o+'"></div></div>');v=v+p}d=d+p}}function S(n,r,i){if(i==t)i==80;setTimeout(function(){n.find(".slotholder .slot").each(function(){clearTimeout(e(this).data("tout"));e(this).remove()});r.transition=0},i)}function x(e,t){var n=e.find(">li:eq("+t.act+")");var r=e.find(">li:eq("+t.next+")");var i=r.find(".tp-caption");if(i.find("iframe")==0){if(i.hasClass("hcenter"))i.css({height:t.height+"px",top:"0px",left:t.width/2-i.outerWidth()/2+"px"});else if(i.hasClass("vcenter"))i.css({width:t.width+"px",left:"0px",top:t.height/2-i.outerHeight()/2+"px"})}}function T(e,n){try{var r=e.find(">ul:first-child >li:eq("+n.act+")")}catch(i){var r=e.find(">ul:first-child >li:eq(1)")}n.lastslide=n.act;var s=e.find(">ul:first-child >li:eq("+n.next+")");var a=s.find(".defaultimg");if(a.data("lazyload")!=t&&a.data("lazydone")!=1){a.attr("src",s.find(".defaultimg").data("lazyload")),a.data("orgw",0);e.find(".tp-loader").css({display:"block"}).transition({opacity:1,duration:300});setTimeout(function(){u(n,e)},180);s.waitForImages(function(){a.data("lazydone",1);setTimeout(function(){o(n,e)},190);g(a,n);m(e,n);g(a,n);N(e,n);e.find(".tp-loader").transition({opacity:0,duration:300});setTimeout(function(){e.find(".tp-loader").css({display:"none"})},2200)})}else{N(e,n)}}function N(n,r){n.trigger("revolution.slide.onbeforeswap");r.transition=1;r.videoplaying=false;try{var i=n.find(">ul:first-child >li:eq("+r.act+")")}catch(s){var i=n.find(">ul:first-child >li:eq(1)")}r.lastslide=r.act;var o=n.find(">ul:first-child >li:eq("+r.next+")");var u=i.find(".slotholder");var a=o.find(".slotholder");i.css({visibility:"visible"});o.css({visibility:"visible"});if(r.ie){if(p=="boxfade")p="boxslide";if(p=="slotfade-vertical")p="slotzoom-vertical";if(p=="slotfade-horizontal")p="slotzoom-horizontal"}if(o.data("delay")!=t){r.cd=0;r.delay=o.data("delay")}else{r.delay=r.origcd}i.css({left:"0px",top:"0px"});o.css({left:"0px",top:"0px"});if(o.data("differentissplayed")=="prepared"){o.data("differentissplayed","done");o.data("transition",o.data("savedtransition"));o.data("slotamount",o.data("savedslotamount"));o.data("masterspeed",o.data("savedmasterspeed"))}if(o.data("fstransition")!=t&&o.data("differentissplayed")!="done"){o.data("savedtransition",o.data("transition"));o.data("savedslotamount",o.data("slotamount"));o.data("savedmasterspeed",o.data("masterspeed"));o.data("transition",o.data("fstransition"));o.data("slotamount",o.data("fsslotamount"));o.data("masterspeed",o.data("fsmasterspeed"));o.data("differentissplayed","prepared")}var f=0;var c=o.data("transition").split(",");var h=o.data("nexttransid");if(h==t){h=0;o.data("nexttransid",h)}else{h=h+1;if(h==c.length)h=0;o.data("nexttransid",h)}var p=c[h];if(p=="boxslide")f=0;else if(p=="boxfade")f=1;else if(p=="slotslide-horizontal")f=2;else if(p=="slotslide-vertical")f=3;else if(p=="curtain-1")f=4;else if(p=="curtain-2")f=5;else if(p=="curtain-3")f=6;else if(p=="slotzoom-horizontal")f=7;else if(p=="slotzoom-vertical")f=8;else if(p=="slotfade-horizontal")f=9;else if(p=="slotfade-vertical")f=10;else if(p=="fade")f=11;else if(p=="slideleft")f=12;else if(p=="slideup")f=13;else if(p=="slidedown")f=14;else if(p=="slideright")f=15;else if(p=="papercut")f=16;else if(p=="3dcurtain-horizontal")f=17;else if(p=="3dcurtain-vertical")f=18;else if(p=="cubic"||p=="cube")f=19;else if(p=="flyin")f=20;else if(p=="turnoff")f=21;else{f=Math.round(Math.random()*21);o.data("slotamount",Math.round(Math.random()*12+4))}if(p=="random-static"){f=Math.round(Math.random()*16);if(f>15)f=15;if(f<0)f=0}if(p=="random-premium"){f=Math.round(Math.random()*6+16);if(f>21)f=21;if(f<16)f=16}var d=-1;if(r.leftarrowpressed==1||r.act>r.next)d=1;if(p=="slidehorizontal"){f=12;if(r.leftarrowpressed==1)f=15}if(p=="slidevertical"){f=13;if(r.leftarrowpressed==1)f=14}r.leftarrowpressed=0;if(f>21)f=21;if(f<0)f=0;if((r.ie||r.ie9)&&f>18){f=Math.round(Math.random()*16);o.data("slotamount",Math.round(Math.random()*12+4))}if(r.ie&&(f==17||f==16||f==2||f==3||f==9||f==10))f=Math.round(Math.random()*3+12);if(r.ie9&&f==3)f=4;var v=300;if(o.data("masterspeed")!=t&&o.data("masterspeed")>99&&o.data("masterspeed")<4001)v=o.data("masterspeed");n.parent().find(".bullet").each(function(){var t=e(this);t.removeClass("selected");if(r.navigationArrows=="withbullet"||r.navigationArrows=="nexttobullets"){if(t.index()-1==r.next)t.addClass("selected")}else{if(t.index()==r.next)t.addClass("selected")}});n.find(">li").each(function(){var t=e(this);if(t.index!=r.act&&t.index!=r.next)t.css({"z-index":16})});i.css({"z-index":18});o.css({"z-index":20});o.css({opacity:0});if(i.index()!=o.index()){H(i,r)}D(o,r);if(o.data("slotamount")==t||o.data("slotamount")<1){r.slots=Math.round(Math.random()*12+4);if(p=="boxslide")r.slots=Math.round(Math.random()*6+3)}else{r.slots=o.data("slotamount")}if(o.data("rotate")==t)r.rotate=0;else if(o.data("rotate")==999)r.rotate=Math.round(Math.random()*360);else r.rotate=o.data("rotate");if(!e.support.transition||r.ie||r.ie9)r.rotate=0;if(r.firststart==1){i.css({opacity:0});r.firststart=0}if(f==0){v=v+100;if(r.slots>10)r.slots=10;o.css({opacity:1});E(u,r,true);E(a,r,false);a.find(".defaultimg").css({opacity:0});a.find(".slotslide").each(function(t){var s=e(this);if(r.ie9)s.transition({top:0-r.sloth,left:0-r.slotw},0);else s.transition({top:0-r.sloth,left:0-r.slotw,rotate:r.rotate},0);setTimeout(function(){s.transition({top:0,left:0,scale:1,rotate:0},v*1.5,function(){if(t==r.slots*r.slots-1){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)}})},t*15)})}if(f==1){if(r.slots>5)r.slots=5;o.css({opacity:1});E(a,r,false);a.find(".defaultimg").css({opacity:0});a.find(".slotslide").each(function(t){var s=e(this);s.css({opacity:0});s.find("img").css({opacity:0});if(r.ie9)s.find("img").transition({top:Math.random()*r.slotw-r.slotw+"px",left:Math.random()*r.slotw-r.slotw+"px"},0);else s.find("img").transition({top:Math.random()*r.slotw-r.slotw+"px",left:Math.random()*r.slotw-r.slotw+"px",rotate:r.rotate},0);var f=Math.random()*1e3+(v+200);if(t==r.slots*r.slots-1)f=1500;s.find("img").transition({opacity:1,top:0-s.data("y")+"px",left:0-s.data("x")+"px",rotate:0},f);s.transition({opacity:1},f,function(){if(t==r.slots*r.slots-1){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)}})})}if(f==2){v=v+200;o.css({opacity:1});b(u,r,true);b(a,r,false);a.find(".defaultimg").css({opacity:0});u.find(".slotslide").each(function(){var t=e(this);t.transit({left:r.slotw+"px",rotate:0-r.rotate},v,function(){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)})});a.find(".slotslide").each(function(){var t=e(this);if(r.ie9)t.transit({left:0-r.slotw+"px"},0);else t.transit({left:0-r.slotw+"px",rotate:r.rotate},0);t.transit({left:"0px",rotate:0},v,function(){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});if(r.ie)u.find(".defaultimg").css({opacity:1});r.act=r.next;l(n)})})}if(f==3){v=v+200;o.css({opacity:1});w(u,r,true);w(a,r,false);a.find(".defaultimg").css({opacity:0});u.find(".slotslide").each(function(){var t=e(this);t.transit({top:r.sloth+"px",rotate:r.rotate},v,function(){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)})});a.find(".slotslide").each(function(){var t=e(this);if(r.ie9)t.transit({top:0-r.sloth+"px"},0);else t.transit({top:0-r.sloth+"px",rotate:r.rotate},0);t.transit({top:"0px",rotate:0},v,function(){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)})})}if(f==4){o.css({opacity:1});b(u,r,true);b(a,r,true);a.find(".defaultimg").css({opacity:0});u.find(".defaultimg").css({opacity:0});u.find(".slotslide").each(function(t){var n=e(this);n.transit({top:0+r.height+"px",opacity:1,rotate:r.rotate},v+t*(70-r.slots))});a.find(".slotslide").each(function(t){var s=e(this);if(r.ie9)s.transition({top:0-r.height+"px",opacity:0},0);else s.transition({top:0-r.height+"px",opacity:0,rotate:r.rotate},0);s.transition({top:"0px",opacity:1,rotate:0},v+t*(70-r.slots),function(){if(t==r.slots-1){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)}})})}if(f==5){o.css({opacity:1});b(u,r,true);b(a,r,true);a.find(".defaultimg").css({opacity:0});u.find(".defaultimg").css({opacity:0});u.find(".slotslide").each(function(t){var n=e(this);n.transition({top:0+r.height+"px",opacity:1,rotate:r.rotate},v+(r.slots-t)*(70-r.slots))});a.find(".slotslide").each(function(t){var s=e(this);if(r.ie9)s.transition({top:0-r.height+"px",opacity:0},0);else s.transition({top:0-r.height+"px",opacity:0,rotate:r.rotate},0);s.transition({top:"0px",opacity:1,rotate:0},v+(r.slots-t)*(70-r.slots),function(){if(t==0){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)}})})}if(f==6){o.css({opacity:1});if(r.slots<2)r.slots=2;b(u,r,true);b(a,r,true);a.find(".defaultimg").css({opacity:0});u.find(".defaultimg").css({opacity:0});u.find(".slotslide").each(function(t){var n=e(this);if(t<r.slots/2)var i=(t+2)*60;else var i=(2+r.slots-t)*60;n.transition({top:0+r.height+"px",opacity:1},v+i)});a.find(".slotslide").each(function(t){var s=e(this);if(r.ie9)s.transition({top:0-r.height+"px",opacity:0},0);else s.transition({top:0-r.height+"px",opacity:0,rotate:r.rotate},0);if(t<r.slots/2)var f=(t+2)*60;else var f=(2+r.slots-t)*60;s.transition({top:"0px",opacity:1,rotate:0},v+f,function(){if(t==Math.round(r.slots/2)){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)}})})}if(f==7){v=v*3;o.css({opacity:1});b(u,r,true);b(a,r,true);a.find(".defaultimg").css({opacity:0});u.find(".slotslide").each(function(){var t=e(this).find("img");t.transition({left:0-r.slotw/2+"px",top:0-r.height/2+"px",width:r.slotw*2+"px",height:r.height*2+"px",opacity:0,rotate:r.rotate},v,function(){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)})});/						/;a.find(".slotslide").each(function(t){var s=e(this).find("img");if(r.ie9)s.transition({left:0+"px",top:0+"px",opacity:0},0);else s.transition({left:0+"px",top:0+"px",opacity:0,rotate:r.rotate},0);s.transition({left:0-t*r.slotw+"px",top:0+"px",width:a.find(".defaultimg").data("neww")+"px",height:a.find(".defaultimg").data("newh")+"px",opacity:1,rotate:0},v,function(){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)})})}if(f==8){v=v*3;o.css({opacity:1});w(u,r,true);w(a,r,true);a.find(".defaultimg").css({opacity:0});u.find(".slotslide").each(function(){var t=e(this).find("img");t.transition({left:0-r.width/2+"px",top:0-r.sloth/2+"px",width:r.width*2+"px",height:r.sloth*2+"px",opacity:0,rotate:r.rotate},v,function(){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)})});a.find(".slotslide").each(function(t){var s=e(this).find("img");if(r.ie9)s.transition({left:0+"px",top:0+"px",opacity:0},0);else s.transition({left:0+"px",top:0+"px",opacity:0,rotate:r.rotate},0);s.transition({left:0+"px",top:0-t*r.sloth+"px",width:a.find(".defaultimg").data("neww")+"px",height:a.find(".defaultimg").data("newh")+"px",opacity:1,rotate:0},v,function(){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)})})}if(f==9){o.css({opacity:1});r.slots=r.width/20;b(a,r,true);a.find(".defaultimg").css({opacity:0});var m=0;a.find(".slotslide").each(function(t){var n=e(this);m++;n.transition({opacity:0,x:0,y:0},0);n.data("tout",setTimeout(function(){n.transition({x:0,y:0,opacity:1},v)},t*4))});setTimeout(function(){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});if(r.ie)u.find(".defaultimg").css({opacity:1});r.act=r.next;l(n)},v+m*4)}if(f==10){o.css({opacity:1});r.slots=r.height/20;w(a,r,true);a.find(".defaultimg").css({opacity:0});var m=0;a.find(".slotslide").each(function(t){var n=e(this);m++;n.transition({opacity:0,x:0,y:0},0);n.data("tout",setTimeout(function(){n.transition({x:0,y:0,opacity:1},v)},t*4))});setTimeout(function(){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});if(r.ie)u.find(".defaultimg").css({opacity:1});r.act=r.next;l(n)},v+m*4)}if(f==11){o.css({opacity:1});r.slots=1;b(a,r,true);a.find(".defaultimg").css({opacity:0,position:"relative"});var m=0;a.find(".slotslide").each(function(t){var n=e(this);m++;if(r.ie9||r.ie){if(r.ie)o.css({opacity:"0"});n.css({opacity:0})}else n.transition({opacity:0,rotate:r.rotate},0);setTimeout(function(){if(r.ie9||r.ie){if(r.ie)o.animate({opacity:1},{duration:v});else n.transition({opacity:1},v)}else{n.transition({opacity:1,rotate:0},v)}},10)});setTimeout(function(){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});if(r.ie)u.find(".defaultimg").css({opacity:1});r.act=r.next;l(n)},v+15)}if(f==12||f==13||f==14||f==15){v=v*3;o.css({opacity:1});r.slots=1;b(a,r,true);b(u,r,true);u.find(".defaultimg").css({opacity:0});a.find(".defaultimg").css({opacity:0});var g=r.width;var y=r.height;var x=a.find(".slotslide");if(r.fullWidth=="on"||r.fullSreen=="on"){g=x.width();y=x.height()}if(f==12)if(r.ie9){x.transition({left:g+"px"},0)}else{x.transition({left:g+"px",rotate:r.rotate},0)}else if(f==15)if(r.ie9)x.transition({left:0-g+"px"},0);else x.transition({left:0-g+"px",rotate:r.rotate},0);else if(f==13)if(r.ie9)x.transition({top:y+"px"},0);else x.transition({top:y+"px",rotate:r.rotate},0);else if(f==14)if(r.ie9)x.transition({top:0-y+"px"},0);else x.transition({top:0-y+"px",rotate:r.rotate},0);x.transition({left:"0px",top:"0px",opacity:1,rotate:0},v,function(){S(n,r,0);if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});a.find(".defaultimg").css({opacity:1});r.act=r.next;l(n)});var T=u.find(".slotslide");if(f==12)T.transition({left:0-g+"px",opacity:1,rotate:0},v);else if(f==15)T.transition({left:g+"px",opacity:1,rotate:0},v);else if(f==13)T.transition({top:0-y+"px",opacity:1,rotate:0},v);else if(f==14)T.transition({top:y+"px",opacity:1,rotate:0},v)}if(f==16){if(v<600)v=600;i.css({position:"absolute","z-index":20});o.css({position:"absolute","z-index":15});i.wrapInner('<div class="tp-half-one"></div>');i.find(".tp-half-one").clone(true).appendTo(i).addClass("tp-half-two");i.find(".tp-half-two").removeClass("tp-half-one");i.find(".tp-half-two").wrapInner('<div class="tp-offset"></div>');var g=r.width;var y=r.height;if(r.fullWidth=="on"||r.fullSreen=="on"){g=r.container.parent().width();y=r.container.parent().height()}var N=i.find(".defaultimg");if(N.length>0&&N.data("fullwidthcentering")=="on"){var C=y/2;var k=N.position().top}else{var C=y/2;var k=0}i.find(".tp-half-one").css({width:g+"px",height:C+"px",overflow:"hidden",position:"absolute",top:"0px",left:"0px"});i.find(".tp-half-two").css({width:g+"px",height:C+"px",overflow:"hidden",position:"absolute",top:C+"px",left:"0px"});i.find(".tp-half-two .tp-offset").css({position:"absolute",top:0-C+"px",left:"0px"});if(!e.support.transition){i.find(".tp-half-one").animate({opacity:0,top:0-y/2+"px"},{duration:v,queue:false});i.find(".tp-half-two").animate({opacity:0,top:y+"px"},{duration:v,queue:false})}else{var L=Math.round(Math.random()*40-20);var A=Math.round(Math.random()*40-20);var O=Math.random()*1+1;var M=Math.random()*1+1;i.find(".tp-half-one").transition({opacity:1,scale:O,rotate:L,y:0-y/1.4+"px"},v,"in");i.find(".tp-half-two").transition({opacity:1,scale:M,rotate:A,y:0+y/1.4+"px"},v,"in");if(i.html()!=null)o.transition({scale:.8,x:r.width*.1,y:y*.1,rotate:L},0).transition({rotate:0,scale:1,x:0,y:0},v-100,"snap")}a.find(".defaultimg").css({opacity:1});setTimeout(function(){i.css({position:"absolute","z-index":18});o.css({position:"absolute","z-index":20});a.find(".defaultimg").css({opacity:1});u.find(".defaultimg").css({opacity:0});if(i.find(".tp-half-one").length>0){i.find(".tp-half-one >img, .tp-half-one >div").unwrap()}i.find(".tp-half-two").remove();r.transition=0;r.act=r.next},v);o.css({opacity:1})}if(f==17){v=v+100;if(r.slots>10)r.slots=10;o.css({opacity:1});w(u,r,true);w(a,r,false);a.find(".defaultimg").css({opacity:0});a.find(".slotslide").each(function(t){var s=e(this);s.transition({opacity:0,rotateY:350,rotateX:40,perspective:"1400px"},0);setTimeout(function(){s.transition({opacity:1,top:0,left:0,scale:1,perspective:"150px",rotate:0,rotateY:0,rotateX:0},v*2,function(){if(t==r.slots-1){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)}})},t*100)})}if(f==18){v=v+100;if(r.slots>10)r.slots=10;o.css({opacity:1});b(u,r,true);b(a,r,false);a.find(".defaultimg").css({opacity:0});a.find(".slotslide").each(function(t){var s=e(this);s.transition({rotateX:10,rotateY:310,perspective:"1400px",rotate:0,opacity:0},0);setTimeout(function(){s.transition({top:0,left:0,scale:1,perspective:"150px",rotate:0,rotateY:0,rotateX:0,opacity:1},v*2,function(){if(t==r.slots-1){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)}})},t*100)})}if(f==19){v=v+100;if(r.slots>10)r.slots=10;o.css({opacity:1});b(u,r,true);b(a,r,false);a.find(".defaultimg").css({opacity:0});var _=o.css("z-index");var P=i.css("z-index");a.find(".slotslide").each(function(t){var s=e(this);s.parent().css({overflow:"visible"});s.css({background:"#333"});if(d==1)s.transition({opacity:0,left:0,top:r.height/2,rotate3d:"1, 0, 0, -90deg "},0);else s.transition({opacity:0,left:0,top:0-r.height/2,rotate3d:"1, 0, 0, 90deg "},0);setTimeout(function(){s.transition({opacity:1,top:0,perspective:r.height*2,rotate3d:" 1, 0, 0, 0deg "},v*2,function(){if(t==r.slots-1){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)}})},t*150)});u.find(".slotslide").each(function(t){var n=e(this);n.parent().css({overflow:"visible"});n.css({background:"#333"});n.transition({top:0,rotate3d:"1, 0, 0, 0deg"},0);u.find(".defaultimg").css({opacity:0});setTimeout(function(){if(d==1)n.transition({opacity:.6,left:0,perspective:r.height*2,top:0-r.height/2,rotate3d:"1, 0, 0, 90deg"},v*2,function(){});else n.transition({opacity:.6,left:0,perspective:r.height*2,top:0+r.height/2,rotate3d:"1, 0, 0, -90deg"},v*2,function(){})},t*150)})}if(f==20){v=v+100;if(r.slots>10)r.slots=10;o.css({opacity:1});w(u,r,true);w(a,r,false);a.find(".defaultimg").css({opacity:0});a.find(".slotslide").each(function(t){var s=e(this);s.parent().css({overflow:"visible"});if(d==1)s.transition({scale:.8,top:0,left:0-r.width,rotate3d:"2, 5, 0, 110deg"},0);else s.transition({scale:.8,top:0,left:0+r.width,rotate3d:"2, 5, 0, -110deg"},0);setTimeout(function(){s.transition({scale:.8,left:0,perspective:r.width,rotate3d:"1, 5, 0, 0deg"},v*2,"ease").transition({scale:1},200,"out",function(){if(t==r.slots-1){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)}})},t*100)});u.find(".slotslide").each(function(t){var n=e(this);n.transition({scale:.5,left:0,rotate3d:"1, 5, 0, 5deg"},300,"in-out");u.find(".defaultimg").css({opacity:0});setTimeout(function(){if(d==1)n.transition({top:0,left:r.width/2,perspective:r.width,rotate3d:"0, -3, 0, 70deg",opacity:0},v*2,"out",function(){});else n.transition({top:0,left:0-r.width/2,perspective:r.width,rotate3d:"0, -3, 0, -70deg",opacity:0},v*2,"out",function(){})},t*100)})}if(f==21){v=v+100;if(r.slots>10)r.slots=10;o.css({opacity:1});w(u,r,true);w(a,r,false);a.find(".defaultimg").css({opacity:0});a.find(".slotslide").each(function(t){var s=e(this);if(d==1)s.transition({top:0,left:0-r.width,rotate3d:"0, 1, 0, 90deg"},0);else s.transition({top:0,left:0+r.width,rotate3d:"0, 1, 0, -90deg"},0);setTimeout(function(){s.transition({left:0,perspective:r.width*2,rotate3d:"0, 0, 0, 0deg"},v*2,function(){if(t==r.slots-1){S(n,r);a.find(".defaultimg").css({opacity:1});if(o.index()!=i.index())u.find(".defaultimg").css({opacity:0});r.act=r.next;l(n)}})},t*100)});u.find(".slotslide").each(function(t){var n=e(this);n.transition({left:0,rotate3d:"0, 0, 0, 0deg"},0);u.find(".defaultimg").css({opacity:0});setTimeout(function(){if(d==1)n.transition({top:0,left:r.width/2,perspective:r.width,rotate3d:"0, 1, 0, -90deg"},v*1.5,function(){});else n.transition({top:0,left:0-r.width/2,perspective:r.width,rotate3d:"0, 1, 0, +90deg"},v*1.5,function(){})},t*100)})}var B={};B.slideIndex=r.next+1;n.trigger("revolution.slide.onchange",B);setTimeout(function(){n.trigger("revolution.slide.onafterswap")},v);n.trigger("revolution.slide.onvideostop")}function C(){}function k(t){var n=t.target.getVideoEmbedCode();var r=e("#"+n.split('id="')[1].split('"')[0]).closest(".tp-simpleresponsive");if(t.data==YT.PlayerState.PLAYING){var i=r.find(".tp-bannertimer");var s=i.data("opt");i.stop();s.videoplaying=true;s.videostartednow=1}else{var i=r.find(".tp-bannertimer");var s=i.data("opt");if(t.data!=-1){if(s.conthover==0)i.animate({width:"100%"},{duration:s.delay-s.cd-100,queue:false,easing:"linear"});s.videoplaying=false;s.videostoppednow=1}}if(t.data==0&&s.nextslideatend==true)s.container.revnext()}function L(e){e.target.playVideo()}function A(e,t,n){if(e.addEventListener){e.addEventListener(t,n,false)}else{e.attachEvent(t,n,false)}}function O(t){var n=$f(t);var r=e("#"+t).closest(".tp-simpleresponsive");n.addEvent("ready",function(e){n.addEvent("play",function(e){var t=r.find(".tp-bannertimer");var n=t.data("opt");t.stop();n.videoplaying=true});n.addEvent("finish",function(e){var t=r.find(".tp-bannertimer");var n=t.data("opt");if(n.conthover==0)t.animate({width:"100%"},{duration:n.delay-n.cd-100,queue:false,easing:"linear"});n.videoplaying=false;n.videostartednow=1;if(n.nextslideatend==true)n.container.revnext()});n.addEvent("pause",function(e){var t=r.find(".tp-bannertimer");var n=t.data("opt");if(n.conthover==0)t.animate({width:"100%"},{duration:n.delay-n.cd-100,queue:false,easing:"linear"});n.videoplaying=false;n.videostoppednow=1})})}function M(t){var n=$f(t);var r=e("#"+t).closest(".tp-simpleresponsive");n.addEvent("ready",function(e){n.api("play")});n.addEvent("play",function(e){var t=r.find(".tp-bannertimer");var n=t.data("opt");t.stop();n.videoplaying=true});n.addEvent("finish",function(e){var t=r.find(".tp-bannertimer");var n=t.data("opt");if(n.conthover==0)t.animate({width:"100%"},{duration:n.delay-n.cd-100,queue:false,easing:"linear"});n.videoplaying=false;n.videostartednow=1;if(n.nextslideatend==true)n.container.revnext()});n.addEvent("pause",function(e){var t=r.find(".tp-bannertimer");var n=t.data("opt");if(n.conthover==0)t.animate({width:"100%"},{duration:n.delay-n.cd-100,queue:false,easing:"linear"});n.videoplaying=false;n.videostoppednow=1})}function _(t){t.on("play",function(){var t=e("body").find(".tp-bannertimer");var n=t.data("opt");t.stop();try{n.videoplaying=true}catch(r){}});t.on("pause",function(){var t=e("body").find(".tp-bannertimer");var n=t.data("opt");if(n.conthover==0)t.animate({width:"100%"},{duration:n.delay-n.cd-100,queue:false,easing:"linear"});n.videoplaying=false;n.videostoppednow=1});t.on("ended",function(){var t=e("body").find(".tp-bannertimer");var n=t.data("opt");if(n.conthover==0)t.animate({width:"100%"},{duration:n.delay-n.cd-100,queue:false,easing:"linear"});n.videoplaying=false;n.videostoppednow=1;if(n.nextslideatend==true)n.container.revnext()})}function D(n,r,i){var s=0;var o=0;n.find(".tp-caption").each(function(i){s=r.width/2-r.startwidth/2;if(r.bh>1){r.bw=1;r.bh=1}if(r.bw>1){r.bw=1;r.bh=1}var u=r.bw;var a=r.bh;if(r.fullScreen=="on")o=r.height/2-r.startheight*r.bh/2;if(o<0)o=0;var f=n.find(".tp-caption:eq("+i+")");var l=0;if(r.width<r.hideCaptionAtLimit&&f.data("captionhidden")=="on"){f.addClass("tp-hidden-caption");l=1}else{if(r.width<r.hideAllCaptionAtLilmit){f.addClass("tp-hidden-caption");l=1}else{f.removeClass("tp-hidden-caption")}}f.stop(true,true);if(l==0){if(f.data("linktoslide")!=t){f.css({cursor:"pointer"});if(f.data("linktoslide")!="no"){f.click(function(){var t=e(this);var n=t.data("linktoslide");if(n!="next"&&n!="prev"){r.container.data("showus",n);r.container.parent().find(".tp-rightarrow").click()}else if(n=="next")r.container.parent().find(".tp-rightarrow").click();else if(n=="prev")r.container.parent().find(".tp-leftarrow").click()})}}if(f.hasClass("coloredbg"))s=0;if(s<0)s=0;clearTimeout(f.data("timer"));clearTimeout(f.data("timer-end"));var c="iframe"+Math.round(Math.random()*1e3+1);if(f.find("iframe").length>0){f.find("iframe").each(function(){var n=e(this);if(n.attr("src").toLowerCase().indexOf("youtube")>=0){r.nextslideatend=f.data("nextslideatend");if(!n.hasClass("HasListener")){try{n.attr("id",c);var i;if(f.data("autoplay")==true)i=new YT.Player(c,{events:{onStateChange:k,onReady:L}});else i=new YT.Player(c,{events:{onStateChange:k}});n.addClass("HasListener");f.data("player",i);if(f.data("autoplay")==true){var s=e("body").find("#"+r.container.attr("id")).find(".tp-bannertimer");setTimeout(function(){s.stop();r.videoplaying=true},200)}}catch(o){}}else{if(f.data("autoplay")==true){var i=f.data("player");f.data("timerplay",setTimeout(function(){i.playVideo()},f.data("start")));var s=e("body").find("#"+r.container.attr("id")).find(".tp-bannertimer");setTimeout(function(){s.stop();r.videoplaying=true},200)}}}else{if(n.attr("src").toLowerCase().indexOf("vimeo")>=0){r.nextslideatend=f.data("nextslideatend");if(!n.hasClass("HasListener")){n.addClass("HasListener");n.attr("id",c);var u=n.attr("src");var a={},l=u,h=/([^&=]+)=([^&]*)/g,p;while(p=h.exec(l)){a[decodeURIComponent(p[1])]=decodeURIComponent(p[2])}if(a["player_id"]!=t){u=u.replace(a["player_id"],c)}else{u=u+"&player_id="+c}try{u=u.replace("api=0","api=1")}catch(o){}u=u+"&api=1";n.attr("src",u);var i=f.find("iframe")[0];if(f.data("autoplay")==true){$f(i).addEvent("ready",M);var s=e("body").find("#"+r.container.attr("id")).find(".tp-bannertimer");setTimeout(function(){s.stop();r.videoplaying=true},200)}else{$f(i).addEvent("ready",O)}}else{if(f.data("autoplay")==true){var n=f.find("iframe");var d=n.attr("id");var v=$f(d);f.data("timerplay",setTimeout(function(){v.api("play")},f.data("start")));var s=e("body").find("#"+r.container.attr("id")).find(".tp-bannertimer");setTimeout(function(){s.stop();r.videoplaying=true},200)}}}}})}if(f.find("video").length>0){f.find("video").each(function(n){var i=e(this).parent();if(i.hasClass("video-js")){r.nextslideatend=f.data("nextslideatend");if(!i.hasClass("HasListener")){i.addClass("HasListener");var s="videoid_"+Math.round(Math.random()*1e3+1);i.attr("id",s);videojs(s).ready(function(){_(this)})}else{s=i.attr("id")}if(f.data("autoplay")==true){var o=e("body").find("#"+r.container.attr("id")).find(".tp-bannertimer");setTimeout(function(){o.stop();r.videoplaying=true},200);videojs(s).ready(function(){var e=this;i.data("timerplay",setTimeout(function(){e.play()},f.data("start")))})}if(i.data("ww")==t)i.data("ww",i.width());if(i.data("hh")==t)i.data("hh",i.height());videojs(s).ready(function(){if(!f.hasClass("fullscreenvideo")){var e=videojs(s);try{e.width(i.data("ww")*r.bw);e.height(i.data("hh")*r.bh)}catch(t){}}})}})}if(f.hasClass("randomrotate")&&(r.ie||r.ie9))f.removeClass("randomrotate").addClass("sfb");f.removeClass("noFilterClass");var h=0;var p=0;if(f.find("img").length>0){var d=f.find("img");if(d.data("ww")==t)d.data("ww",d.width());if(d.data("hh")==t)d.data("hh",d.height());var v=d.data("ww");var m=d.data("hh");d.width(v*r.bw);d.height(m*r.bh);h=d.width();p=d.height()}else{if(f.find("iframe").length>0){var d=f.find("iframe");if(f.data("ww")==t){f.data("ww",d.width())}if(f.data("hh")==t)f.data("hh",d.height());var v=f.data("ww");var m=f.data("hh");var g=f;if(g.data("fsize")==t)g.data("fsize",parseInt(g.css("font-size"),0)||0);if(g.data("pt")==t)g.data("pt",parseInt(g.css("paddingTop"),0)||0);if(g.data("pb")==t)g.data("pb",parseInt(g.css("paddingBottom"),0)||0);if(g.data("pl")==t)g.data("pl",parseInt(g.css("paddingLeft"),0)||0);if(g.data("pr")==t)g.data("pr",parseInt(g.css("paddingRight"),0)||0);if(g.data("mt")==t)g.data("mt",parseInt(g.css("marginTop"),0)||0);if(g.data("mb")==t)g.data("mb",parseInt(g.css("marginBottom"),0)||0);if(g.data("ml")==t)g.data("ml",parseInt(g.css("marginLeft"),0)||0);if(g.data("mr")==t)g.data("mr",parseInt(g.css("marginRight"),0)||0);if(g.data("bt")==t)g.data("bt",parseInt(g.css("borderTop"),0)||0);if(g.data("bb")==t)g.data("bb",parseInt(g.css("borderBottom"),0)||0);if(g.data("bl")==t)g.data("bl",parseInt(g.css("borderLeft"),0)||0);if(g.data("br")==t)g.data("br",parseInt(g.css("borderRight"),0)||0);if(g.data("lh")==t)g.data("lh",parseInt(g.css("lineHeight"),0)||0);var y=r.width;var b=r.height;if(y>r.startwidth)y=r.startwidth;if(b>r.startheight)b=r.startheight;if(!f.hasClass("fullscreenvideo"))f.css({"font-size":g.data("fsize")*r.bw+"px","padding-top":g.data("pt")*r.bh+"px","padding-bottom":g.data("pb")*r.bh+"px","padding-left":g.data("pl")*r.bw+"px","padding-right":g.data("pr")*r.bw+"px","margin-top":g.data("mt")*r.bh+"px","margin-bottom":g.data("mb")*r.bh+"px","margin-left":g.data("ml")*r.bw+"px","margin-right":g.data("mr")*r.bw+"px","border-top":g.data("bt")*r.bh+"px","border-bottom":g.data("bb")*r.bh+"px","border-left":g.data("bl")*r.bw+"px","border-right":g.data("br")*r.bw+"px","line-height":g.data("lh")*r.bh+"px",height:m*r.bh+"px","white-space":"nowrap"});else{s=0;o=0;f.css({width:r.width,height:r.height})}d.width(v*r.bw);d.height(m*r.bh);h=d.width();p=d.height()}else{f.find(".tp-resizeme, .tp-resizeme *").each(function(){P(e(this),r)});if(f.hasClass("tp-resizeme")){f.find("*").each(function(){P(e(this),r)})}P(f,r);p=f.outerHeight(true);h=f.outerWidth(true);var w=f.outerHeight();var E=f.css("backgroundColor");f.find(".frontcorner").css({borderWidth:w+"px",left:0-w+"px",borderRight:"0px solid transparent",borderTopColor:E});f.find(".frontcornertop").css({borderWidth:w+"px",left:0-w+"px",borderRight:"0px solid transparent",borderBottomColor:E});f.find(".backcorner").css({borderWidth:w+"px",right:0-w+"px",borderLeft:"0px solid transparent",borderBottomColor:E});f.find(".backcornertop").css({borderWidth:w+"px",right:0-w+"px",borderLeft:"0px solid transparent",borderTopColor:E})}}if(f.data("voffset")==t)f.data("voffset",0);if(f.data("hoffset")==t)f.data("hoffset",0);var S=f.data("voffset")*u;var x=f.data("hoffset")*u;var T=r.startwidth*u;var N=r.startheight*u;if(f.data("x")=="center"||f.data("xcenter")=="center"){f.data("xcenter","center");f.data("x",(T/2-f.outerWidth(true)/2)/u+x)}if(f.data("x")=="left"||f.data("xleft")=="left"){f.data("xleft","left");f.data("x",0/u+x)}if(f.data("x")=="right"||f.data("xright")=="right"){f.data("xright","right");f.data("x",(T-f.outerWidth(true)+x)/u)}if(f.data("y")=="center"||f.data("ycenter")=="center"){f.data("ycenter","center");f.data("y",(N/2-f.outerHeight(true)/2)/r.bh+S)}if(f.data("y")=="top"||f.data("ytop")=="top"){f.data("ytop","top");f.data("y",0/r.bh+S)}if(f.data("y")=="bottom"||f.data("ybottom")=="bottom"){f.data("ybottom","bottom");f.data("y",(N-f.outerHeight(true)+S)/u)}if(f.hasClass("fade")){f.css({opacity:0,left:u*f.data("x")+s+"px",top:r.bh*f.data("y")+o+"px"})}if(f.hasClass("randomrotate")){f.css({left:u*f.data("x")+s+"px",top:a*f.data("y")+o+"px"});var C=Math.random()*2+1;var A=Math.round(Math.random()*200-100);var D=Math.round(Math.random()*200-100);var H=Math.round(Math.random()*200-100);f.data("repx",D);f.data("repy",H);f.data("repo",f.css("opacity"));f.data("rotate",A);f.data("scale",C);f.transition({opacity:0,scale:C,rotate:A,x:D,y:H,duration:"0ms"})}else{if(r.ie||r.ie9){}else{if(f.find("iframe").length==0)f.transition({scale:1,rotate:0})}}if(f.hasClass("lfr")){f.css({opacity:1,left:15+r.width+"px",top:r.bh*f.data("y")+o+"px"})}if(f.hasClass("lfl")){f.css({opacity:1,left:-15-h+"px",top:r.bh*f.data("y")+o+"px"})}if(f.hasClass("sfl")){f.css({opacity:0,left:u*f.data("x")-50+s+"px",top:r.bh*f.data("y")+o+"px"})}if(f.hasClass("sfr")){f.css({opacity:0,left:u*f.data("x")+50+s+"px",top:r.bh*f.data("y")+o+"px"})}if(f.hasClass("lft")){f.css({opacity:1,left:u*f.data("x")+s+"px",top:-25-p+"px"})}if(f.hasClass("lfb")){f.css({opacity:1,left:u*f.data("x")+s+"px",top:25+r.height+"px"})}if(f.hasClass("sft")){f.css({opacity:0,left:u*f.data("x")+s+"px",top:r.bh*f.data("y")+o-50+"px"})}if(f.hasClass("sfb")){f.css({opacity:0,left:u*f.data("x")+s+"px",top:r.bh*f.data("y")+o+50+"px"})}if(f.data("start")==t)f.data("start",1e3);f.data("timer",setTimeout(function(){var n=f.data("easing");if(n==t)n="linear";if(f.hasClass("fullscreenvideo"))f.css({display:"block"});f.css({visibility:"visible"});if(f.hasClass("fade")){f.data("repo",f.css("opacity"));f.transition({opacity:1,duration:f.data("speed")})}if(f.hasClass("randomrotate")){n=n.replace("Elastic","Back");n=n.replace("Bounce","Back");f.transition({opacity:1,scale:1,left:u*f.data("x")+s+"px",top:a*f.data("y")+o+"px",rotate:0,x:0,y:0,duration:f.data("speed"),easing:n});if(r.ie)f.addClass("noFilterClass")}if(f.hasClass("lfr")||f.hasClass("lfl")||f.hasClass("sfr")||f.hasClass("sfl")||f.hasClass("lft")||f.hasClass("lfb")||f.hasClass("sft")||f.hasClass("sfb")){f.data("repx",f.position().left);f.data("repy",f.position().top);f.data("repo",f.css("opacity"));if(n.indexOf("Bounce")>=0||n.indexOf("Elastic")>=0)f.animate({opacity:1,left:u*f.data("x")+s+"px",top:r.bh*f.data("y")+o+"px"},{duration:f.data("speed"),easing:n,complete:function(){if(r.ie)e(this).addClass("noFilterClass")}});else f.transition({opacity:1,left:u*f.data("x")+s+"px",top:r.bh*f.data("y")+o+"px",duration:f.data("speed"),easing:n})}},f.data("start")));if(f.data("end")!=t)f.data("timer-end",setTimeout(function(){if((r.ie||r.ie9)&&(f.hasClass("randomrotate")||f.hasClass("randomrotateout"))){f.removeClass("randomrotate").removeClass("randomrotateout").addClass("fadeout")}B(f,r)},f.data("end")))}});var u=e("body").find("#"+r.container.attr("id")).find(".tp-bannertimer");u.data("opt",r)}function P(e,n){if(e.data("fsize")==t)e.data("fsize",parseInt(e.css("font-size"),0)||0);if(e.data("pt")==t)e.data("pt",parseInt(e.css("paddingTop"),0)||0);if(e.data("pb")==t)e.data("pb",parseInt(e.css("paddingBottom"),0)||0);if(e.data("pl")==t)e.data("pl",parseInt(e.css("paddingLeft"),0)||0);if(e.data("pr")==t)e.data("pr",parseInt(e.css("paddingRight"),0)||0);if(e.data("mt")==t)e.data("mt",parseInt(e.css("marginTop"),0)||0);if(e.data("mb")==t)e.data("mb",parseInt(e.css("marginBottom"),0)||0);if(e.data("ml")==t)e.data("ml",parseInt(e.css("marginLeft"),0)||0);if(e.data("mr")==t)e.data("mr",parseInt(e.css("marginRight"),0)||0);if(e.data("bt")==t)e.data("bt",parseInt(e.css("borderTopWidth"),0)||0);if(e.data("bb")==t)e.data("bb",parseInt(e.css("borderBottomWidth"),0)||0);if(e.data("bl")==t)e.data("bl",parseInt(e.css("borderLeftWidth"),0)||0);if(e.data("br")==t)e.data("br",parseInt(e.css("borderRightWidth"),0)||0);if(e.data("lh")==t)e.data("lh",parseInt(e.css("lineHeight"),0)||0);if(e.data("minwidth")==t)e.data("minwidth",parseInt(e.css("minWidth"),0)||0);if(e.data("minheight")==t)e.data("minheight",parseInt(e.css("minHeight"),0)||0);if(e.data("maxwidth")==t)e.data("maxwidth",parseInt(e.css("maxWidth"),0)||"none");if(e.data("maxheight")==t)e.data("maxheight",parseInt(e.css("maxHeight"),0)||"none");e.css({"font-size":Math.round(e.data("fsize")*n.bw)+"px","padding-top":Math.round(e.data("pt")*n.bh)+"px","padding-bottom":Math.round(e.data("pb")*n.bh)+"px","padding-left":Math.round(e.data("pl")*n.bw)+"px","padding-right":Math.round(e.data("pr")*n.bw)+"px","margin-top":e.data("mt")*n.bh+"px","margin-bottom":e.data("mb")*n.bh+"px","margin-left":e.data("ml")*n.bw+"px","margin-right":e.data("mr")*n.bw+"px",borderTopWidth:Math.round(e.data("bt")*n.bh)+"px",borderBottomWidth:Math.round(e.data("bb")*n.bh)+"px",borderLeftWidth:Math.round(e.data("bl")*n.bw)+"px",borderRightWidth:Math.round(e.data("br")*n.bw)+"px","line-height":Math.round(e.data("lh")*n.bh)+"px","white-space":"nowrap",minWidth:e.data("minwidth")*n.bw+"px",minHeight:e.data("minheight")*n.bh+"px"});if(e.data("maxheight")!="none")e.css({maxHeight:e.data("maxheight")*n.bh+"px"});if(e.data("maxwidth")!="none")e.css({maxWidth:e.data("maxwidth")*n.bw+"px"})}function H(t,n){t.find(".tp-caption").each(function(r){var i=t.find(".tp-caption:eq("+r+")");i.stop(true,true);clearTimeout(i.data("timer"));clearTimeout(i.data("timer-end"));var s=i.data("easing");s="easeInOutSine";var o=i.data("repx");var u=i.data("repy");var a=i.data("repo");var f=i.data("rotate");var l=i.data("scale");if(i.find("iframe").length>0){try{var c=i.find("iframe");var h=c.attr("id");var p=$f(h);p.api("pause");clearTimeout(i.data("timerplay"))}catch(d){}try{var v=i.data("player");v.stopVideo();clearTimeout(i.data("timerplay"))}catch(d){}}if(i.find("video").length>0){try{i.find("video").each(function(t){var n=e(this).parent();var r=n.attr("id");clearTimeout(n.data("timerplay"));videojs(r).ready(function(){var e=this;e.pause()})})}catch(d){}}try{B(i,n)}catch(d){}})}function B(n,r){if(n.hasClass("randomrotate")&&(r.ie||r.ie9))n.removeClass("randomrotate").addClass("sfb");if(n.hasClass("randomrotateout")&&(r.ie||r.ie9))n.removeClass("randomrotateout").addClass("stb");var i=n.data("endspeed");if(i==t)i=n.data("speed");var s=n.data("repx");var o=n.data("repy");var u=n.data("repo");if(r.ie){n.css({opacity:"inherit",filter:"inherit"})}if(n.hasClass("ltr")||n.hasClass("ltl")||n.hasClass("str")||n.hasClass("stl")||n.hasClass("ltt")||n.hasClass("ltb")||n.hasClass("stt")||n.hasClass("stb")){s=n.position().left;o=n.position().top;if(n.hasClass("ltr"))s=r.width+60;else if(n.hasClass("ltl"))s=0-n.width()-60;else if(n.hasClass("ltt"))o=0-n.height()-60;else if(n.hasClass("ltb"))o=r.height+60;else if(n.hasClass("str")){s=s+50;u=0}else if(n.hasClass("stl")){s=s-50;u=0}else if(n.hasClass("stt")){o=o-50;u=0}else if(n.hasClass("stb")){o=o+50;u=0}var a=n.data("endeasing");if(a==t)a="linear";if(a.indexOf("Bounce")>=0||a.indexOf("Elastic")>=0)n.animate({opacity:u,left:s+"px",top:o+"px"},{duration:n.data("endspeed"),easing:a,complete:function(){e(this).css({visibility:"hidden"})}});else n.transition({opacity:u,left:s+"px",top:o+"px",duration:n.data("endspeed"),easing:a});if(r.ie)n.removeClass("noFilterClass")}else if(n.hasClass("randomrotateout")){n.transition({opacity:0,scale:Math.random()*2+.3,left:Math.random()*r.width+"px",top:Math.random()*r.height+"px",rotate:Math.random()*40,duration:i,easing:a,complete:function(){e(this).css({visibility:"hidden"})}});if(r.ie)n.removeClass("noFilterClass")}else if(n.hasClass("fadeout")){if(r.ie)n.removeClass("noFilterClass");n.transition({opacity:0,duration:200})}else if(n.hasClass("lfr")||n.hasClass("lfl")||n.hasClass("sfr")||n.hasClass("sfl")||n.hasClass("lft")||n.hasClass("lfb")||n.hasClass("sft")||n.hasClass("sfb")){if(n.hasClass("lfr"))s=r.width+60;else if(n.hasClass("lfl"))s=0-n.width()-60;else if(n.hasClass("lft"))o=0-n.height()-60;else if(n.hasClass("lfb"))o=r.height+60;var a=n.data("endeasing");if(a==t)a="linear";if(a.indexOf("Bounce")>=0||a.indexOf("Elastic")>=0)n.animate({opacity:u,left:s+"px",top:o+"px"},{duration:n.data("endspeed"),easing:a,complete:function(){e(this).css({visibility:"hidden"})}});else n.transition({opacity:u,left:s+"px",top:o+"px",duration:n.data("endspeed"),easing:a});if(r.ie)n.removeClass("noFilterClass")}else if(n.hasClass("fade")){n.transition({opacity:0,duration:i});if(r.ie)n.removeClass("noFilterClass")}else if(n.hasClass("randomrotate")){n.transition({opacity:0,scale:Math.random()*2+.3,left:Math.random()*r.width+"px",top:Math.random()*r.height+"px",rotate:Math.random()*40,duration:i,easing:a});if(r.ie)n.removeClass("noFilterClass")}}function j(t,n){t.children().each(function(){try{e(this).die("click")}catch(t){}try{e(this).die("mouseenter")}catch(t){}try{e(this).die("mouseleave")}catch(t){}try{e(this).unbind("hover")}catch(t){}});try{t.die("click","mouseenter","mouseleave")}catch(r){}clearInterval(n.cdint);t=null}function F(n,r){r.cd=0;r.loop=0;if(r.stopAfterLoops!=t&&r.stopAfterLoops>-1)r.looptogo=r.stopAfterLoops;else r.looptogo=9999999;if(r.stopAtSlide!=t&&r.stopAtSlide>-1)r.lastslidetoshow=r.stopAtSlide;else r.lastslidetoshow=999;r.stopLoop="off";if(r.looptogo==0)r.stopLoop="on";if(r.slideamount>1&&!(r.stopAfterLoops==0&&r.stopAtSlide==1)){var i=n.find(".tp-bannertimer");if(i.length>0){i.css({width:"0%"});i.animate({width:"100%"},{duration:r.delay-100,queue:false,easing:"linear"})}i.data("opt",r);r.cdint=setInterval(function(){if(e("body").find(n).length==0)j(n,r);if(n.data("conthover-changed")==1){r.conthover=n.data("conthover");n.data("conthover-changed",0)}if(r.conthover!=1&&r.videoplaying!=true&&r.width>r.hideSliderAtLimit)r.cd=r.cd+100;if(r.fullWidth!="on")if(r.width>r.hideSliderAtLimit)n.parent().removeClass("tp-hide-revslider");else n.parent().addClass("tp-hide-revslider");if(r.videostartednow==1){n.trigger("revolution.slide.onvideoplay");r.videostartednow=0}if(r.videostoppednow==1){n.trigger("revolution.slide.onvideostop");r.videostoppednow=0}if(r.cd>=r.delay){r.cd=0;r.act=r.next;r.next=r.next+1;if(r.next>n.find(">ul >li").length-1){r.next=0;r.looptogo=r.looptogo-1;if(r.looptogo<=0){r.stopLoop="on"}}if(r.stopLoop=="on"&&r.next==r.lastslidetoshow-1){clearInterval(r.cdint);n.find(".tp-bannertimer").css({visibility:"hidden"});n.trigger("revolution.slide.onstop")}T(n,r);if(i.length>0){i.css({width:"0%"});i.animate({width:"100%"},{duration:r.delay-100,queue:false,easing:"linear"})}}},100);n.hover(function(){if(r.onHoverStop=="on"){r.conthover=1;i.stop();n.trigger("revolution.slide.onpause")}},function(){if(n.data("conthover")!=1){n.trigger("revolution.slide.onresume");r.conthover=0;if(r.onHoverStop=="on"&&r.videoplaying!=true){i.animate({width:"100%"},{duration:r.delay-r.cd-100,queue:false,easing:"linear"})}}})}}e.fn.extend({revolution:function(i){e.fn.revolution.defaults={delay:9e3,startheight:500,startwidth:960,hideThumbs:200,thumbWidth:100,thumbHeight:50,thumbAmount:5,navigationType:"bullet",navigationArrows:"withbullet",navigationStyle:"round",navigationHAlign:"center",navigationVAlign:"bottom",navigationHOffset:0,navigationVOffset:20,soloArrowLeftHalign:"left",soloArrowLeftValign:"center",soloArrowLeftHOffset:20,soloArrowLeftVOffset:0,soloArrowRightHalign:"right",soloArrowRightValign:"center",soloArrowRightHOffset:20,soloArrowRightVOffset:0,touchenabled:"on",onHoverStop:"on",stopAtSlide:-1,stopAfterLoops:-1,hideCaptionAtLimit:0,hideAllCaptionAtLilmit:0,hideSliderAtLimit:0,shadow:1,fullWidth:"off",fullScreen:"off"};i=e.extend({},e.fn.revolution.defaults,i);return this.each(function(){var o=i;var u=e(this);if(!u.hasClass("revslider-initialised")){u.addClass("revslider-initialised");if(u.attr("id")==t)u.attr("id","revslider-"+Math.round(Math.random()*1e3+5));o.firefox13=false;o.ie=!e.support.opacity;o.ie9=document.documentMode==9;var a=e.fn.jquery.split("."),l=parseFloat(a[0]),c=parseFloat(a[1]),m=parseFloat(a[2]||"0");if(l==1&&c<7){u.html('<div style="text-align:center; padding:40px 0px; font-size:20px; color:#992222;"> The Current Version of jQuery:'+a+" <br>Please update your jQuery Version to min. 1.7 in Case you wish to use the Revolution Slider Plugin</div>")}if(l>1)o.ie=false;if(!e.support.transition)e.fn.transition=e.fn.animate;e.cssEase["Bounce"]="cubic-bezier(0,1,0.5,1.3)";u.find(".caption").each(function(){e(this).addClass("tp-caption")});if(s()){u.find(".tp-caption").each(function(){if(e(this).data("autoplay")==true)e(this).data("autoplay",false)})}var g=0;var b=0;var w=0;u.find(".tp-caption iframe").each(function(t){try{if(e(this).attr("src").indexOf("you")>0&&g==0){g=1;var n=document.createElement("script");n.src="http://www.youtube.com/player_api";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(n,r)}}catch(i){}});u.find(".tp-caption iframe").each(function(t){try{if(e(this).attr("src").indexOf("vim")>0&&b==0){b=1;var n=document.createElement("script");n.src="http://a.vimeocdn.com/js/froogaloop2.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(n,r)}}catch(i){}});u.find(".tp-caption video").each(function(t){try{if(e(this).hasClass("video-js")&&w==0){w=1;var n=document.createElement("script");n.src=o.videoJsPath+"video.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(n,r);e("head").append('<link rel="stylesheet" type="text/css" href="'+o.videoJsPath+'video-js.min.css" media="screen" />');e("head").append('<script> videojs.options.flash.swf = "'+o.videoJsPath+'video-js.swf";</script>')}}catch(i){}});if(o.shuffle=="on"){for(var E=0;E<u.find(">ul:first-child >li").length;E++){var S=Math.round(Math.random()*u.find(">ul:first-child >li").length);u.find(">ul:first-child >li:eq("+S+")").prependTo(u.find(">ul:first-child"))}}o.slots=4;o.act=-1;o.next=0;if(o.startWithSlide!=t)o.next=o.startWithSlide;var x=n("#")[0];if(x.length<9){if(x.split("slide").length>1){var N=parseInt(x.split("slide")[1],0);if(N<1)N=1;if(N>u.find(">ul:first >li").length)N=u.find(">ul:first >li").length;o.next=N-1}}o.origcd=o.delay;o.firststart=1;if(o.navigationHOffset==t)o.navOffsetHorizontal=0;if(o.navigationVOffset==t)o.navOffsetVertical=0;u.append('<div class="tp-loader"></div>');if(u.find(".tp-bannertimer").length==0)u.append('<div class="tp-bannertimer" style="visibility:hidden"></div>');var C=u.find(".tp-bannertimer");if(C.length>0){C.css({width:"0%"})}u.addClass("tp-simpleresponsive");o.container=u;o.slideamount=u.find(">ul:first >li").length;if(u.height()==0)u.height(o.startheight);if(o.startwidth==t||o.startwidth==0)o.startwidth=u.width();if(o.startheight==t||o.startheight==0)o.startheight=u.height();o.width=u.width();o.height=u.height();o.bw=o.startwidth/u.width();o.bh=o.startheight/u.height();if(o.width!=o.startwidth){o.height=Math.round(o.startheight*(o.width/o.startwidth));u.height(o.height)}if(o.shadow!=0){u.parent().append('<div class="tp-bannershadow tp-shadow'+o.shadow+'"></div>');u.parent().find(".tp-bannershadow").css({width:o.width})}u.find("ul").css({display:"none"});if(o.lazyLoad!="on"){u.waitForImages(function(){u.find("ul").css({display:"block"});y(u,o);if(o.slideamount>1)h(u,o);if(o.slideamount>1)f(u,o);if(o.slideamount>1)p(u,o);e("#unvisible_button").click(function(){o.navigationArrows=e(".selectnavarrows").val();o.navigationType=e(".selectnavtype").val();o.navigationStyle=e(".selectnavstyle").val();o.soloArrowStyle="default";e(".tp-bullets").remove();e(".tparrows").remove();if(o.slideamount>1)h(u,o);if(o.slideamount>1)f(u,o);if(o.slideamount>1)p(u,o)});d(u,o);if(o.hideThumbs>0)v(u,o);u.waitForImages(function(){u.find(".tp-loader").fadeOut(600);setTimeout(function(){T(u,o);if(o.slideamount>1)F(u,o);u.trigger("revolution.slide.onloaded")},600)})})}else{var k=u.find("ul >li >img").first();if(k.data("lazyload")!=t)k.attr("src",k.data("lazyload"));k.data("lazydone",1);k.parent().waitForImages(function(){u.find("ul").css({display:"block"});y(u,o);if(o.slideamount>1)h(u,o);if(o.slideamount>1)f(u,o);if(o.slideamount>1)p(u,o);d(u,o);if(o.hideThumbs>0)v(u,o);k.parent().waitForImages(function(){u.find(".tp-loader").fadeOut(600);setTimeout(function(){T(u,o);if(o.slideamount>1)F(u,o);u.trigger("revolution.slide.onloaded")},600)})})}e(window).resize(function(){if(e("body").find(u)!=0)if(u.outerWidth(true)!=o.width){r(u,o)}});u.find(".tp-scrollbelowslider").on("click",function(){var t=0;try{t=e("body").find(o.fullScreenOffsetContainer).height()}catch(n){}try{t=t-e(this).data("scrolloffset")}catch(n){}e("body,html").animate({scrollTop:u.offset().top+u.find(">ul >li").height()-t+"px"},{duration:400})})}})},revscroll:function(t){return this.each(function(){var n=e(this);e("body,html").animate({scrollTop:n.offset().top+n.find(">ul >li").height()-t+"px"},{duration:400})})},revpause:function(t){return this.each(function(){var t=e(this);t.data("conthover",1);t.data("conthover-changed",1);t.trigger("revolution.slide.onpause");var n=t.parent().find(".tp-bannertimer");n.stop()})},revresume:function(t){return this.each(function(){var t=e(this);t.data("conthover",0);t.data("conthover-changed",1);t.trigger("revolution.slide.onresume");var n=t.parent().find(".tp-bannertimer");var r=n.data("opt");n.animate({width:"100%"},{duration:r.delay-r.cd-100,queue:false,easing:"linear"})})},revnext:function(t){return this.each(function(){var t=e(this);t.parent().find(".tp-rightarrow").click()})},revprev:function(t){return this.each(function(){var t=e(this);t.parent().find(".tp-leftarrow").click()})},revmaxslide:function(t){return e(this).find(">ul:first-child >li").length},revcurrentslide:function(t){var n=e(this);var r=n.parent().find(".tp-bannertimer");var i=r.data("opt");return i.act},revlastslide:function(t){var n=e(this);var r=n.parent().find(".tp-bannertimer");var i=r.data("opt");return i.lastslide},revshowslide:function(t){return this.each(function(){var n=e(this);n.data("showus",t);n.parent().find(".tp-rightarrow").click()})}})})(jQuery)
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-touch-shiv-cssclasses-teststyles-prefixes-load
 */
;window.Modernizr=function(a,b,c){function w(a){j.cssText=a}function x(a,b){return w(m.join(a+";")+(b||""))}function y(a,b){return typeof a===b}function z(a,b){return!!~(""+a).indexOf(b)}function A(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:y(f,"function")?f.bind(d||b):f}return!1}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n={},o={},p={},q=[],r=q.slice,s,t=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},u={}.hasOwnProperty,v;!y(u,"undefined")&&!y(u.call,"undefined")?v=function(a,b){return u.call(a,b)}:v=function(a,b){return b in a&&y(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=r.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(r.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(r.call(arguments)))};return e}),n.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:t(["@media (",m.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c};for(var B in n)v(n,B)&&(s=B.toLowerCase(),e[s]=n[B](),q.push((e[s]?"":"no-")+s));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)v(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},w(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._prefixes=m,e.testStyles=t,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+q.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
/*
 * QueryLoader v2 - A simple script to create a preloader for images
 *
 * For instructions read the original post:
 * http://www.gayadesign.com/diy/queryloader2-preload-your-images-with-ease/
 *
 * Copyright (c) 2011 - Gaya Kessler
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version:  2.5
 * Last update: 15-09-2013
 *
 */
(function($){
    $.queryLoader2 = function(el, options){
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("queryLoader2", base);

        //declare variables
        base.qLimageContainer = "";
        base.qLoverlay = "";
        base.qLbar = "";
        base.qLpercentage = "";
        base.qLimages = [];
        base.qLbgimages = [];
        base.qLimageCounter = 0;
        base.qLdone = 0;
        base.qLdestroyed = false;

        base.init = function(){

            base.options = $.extend({},$.queryLoader2.defaultOptions, options);

            //find images
            base.findImageInElement(base.el);
            if (base.options.deepSearch == true) {
                base.$el.find("*:not(script)").each(function() {
                    base.findImageInElement(this);
                });
            }

            //create containers
            base.createPreloadContainer();
            base.createOverlayLoader();
        };

        //the container where unbindable images will go
        base.createPreloadContainer = function() {
            base.qLimageContainer = $("<div></div>").appendTo("body").css({
                display: "none",
                width: 0,
                height: 0,
                overflow: "hidden"
            });

            //add background images for loading
            for (var i = 0; base.qLbgimages.length > i; i++) {
                $.ajax({
                    url: base.qLbgimages[i],
                    type: 'HEAD',
                    complete: function (data) {
                        if (!base.qLdestroyed) {
                            base.addImageForPreload(this['url']);
                        }
                    }
                });
            }
        };

        base.addImageForPreload = function(url) {
            var image = $("<img />").attr("src", url);
            //binding load before the DOM adding
            base.bindLoadEvent(image);
            image.appendTo(base.qLimageContainer);
        };

        //create the overlay
        base.createOverlayLoader = function () {
            var overlayPosition = "absolute";

            if (base.$el.prop("tagName") == "BODY") {
                overlayPosition = "fixed";
            } else {
                base.$el.css("position", "relative");
            }

            base.qLoverlay = $("<div id='" + base.options.overlayId + "'></div>").css({
                width: "100%",
                height: "100%",
                backgroundColor: base.options.backgroundColor,
                backgroundPosition: "fixed",
                position: overlayPosition,
                zIndex: 666999, //very high!
                top: 0,
                left: 0
            }).appendTo(base.$el);

            base.qLbar = $("<div id='qLbar'></div>").css({
                height: base.options.barHeight + "px",
                marginTop: "-" + (base.options.barHeight / 2) + "px",
                backgroundColor: base.options.barColor,
                width: "0%",
                position: "absolute",
                top: "50%"
            }).appendTo(base.qLoverlay);

            if (base.options.percentage == true) {
                base.qLpercentage = $("<div id='qLpercentage'></div>").text("0%").css({
                    height: "40px",
                    width: "100px",
                    position: "absolute",
                    fontSize: "3em",
                    top: "50%",
                    left: "50%",
                    marginTop: "-" + (59 + base.options.barHeight) + "px",
                    textAlign: "center",
                    marginLeft: "-50px",
                    color: base.options.barColor
                }).appendTo(base.qLoverlay);
            }

            if (!base.qLimages.length) {
                base.destroyContainers();
            }
        };

        //destroy all containers created by QueryLoader
        base.destroyContainers = function () {
            base.qLdestroyed = true;
            base.qLimageContainer.remove();
            base.qLoverlay.remove();
        };

        base.findImageInElement = function (element) {
            var url = "";
            var obj = $(element);
            var type = "normal";

            if (obj.css("background-image") != "none") {
                url = obj.css("background-image");
                type = "background";
            } else if (typeof(obj.attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img") {
                url = obj.attr("src");
            }

            if (url.indexOf("gradient") == -1) {
                url = url.replace(/url\(\"/g, "");
                url = url.replace(/url\(/g, "");
                url = url.replace(/\"\)/g, "");
                url = url.replace(/\)/g, "");

                var urls = url.split(", ");

                for (var i = 0; i < urls.length; i++) {
                    if (urls[i].length > 0 && base.qLimages.indexOf(urls[i]) == -1 && !urls[i].match(/^(data:)/i)) {
                        var extra = "";

                        if (base.isIE() || base.isOpera()){
                            //filthy always no cache for IE, sorry peeps!
                            extra = "?rand=" + Math.random();
                            base.qLbgimages.push(urls[i] + extra);
                        } else {
                            if (type == "background") {
                                base.qLbgimages.push(urls[i]);
                            } else {
                                base.bindLoadEvent(obj);
                            }
                        }

                        base.qLimages.push(urls[i]);
                    }
                }
            }
        }

        base.isIE = function () {
            return navigator.userAgent.match(/msie/i);
        };

        base.isOpera = function () {
            return navigator.userAgent.match(/Opera/i);
        };

        base.bindLoadEvent = function (element) {
            base.qLimageCounter++;
            element.bind("load error", function () {
                base.completeImageLoading(this);
            });
        }

        base.completeImageLoading = function (el) {
            base.qLdone++;

            var percentage = (base.qLdone / base.qLimageCounter) * 100;
            base.qLbar.stop().animate({
                width: percentage + "%",
                minWidth: percentage + "%"
            }, 200);

            if (base.options.percentage == true) {
                base.qLpercentage.text(Math.ceil(percentage) + "%");
            }

            if (base.qLdone == base.qLimageCounter) {
                base.endLoader();
            }
        };

        base.endLoader = function () {
            base.qLdestroyed = true;
            base.onLoadComplete();
        };

        base.onLoadComplete = function() {
            if (base.options.completeAnimation == "grow") {
                var animationTime = 500;

                base.qLbar.stop().animate({
                    "width": "100%"
                }, animationTime, function () {
                    $(this).animate({
                        top: "0%",
                        width: "100%",
                        height: "100%"
                    }, 500, function () {
                        $('#' + base.options.overlayId).fadeOut(500, function () {
                            $(this).remove();
                            base.destroyContainers();
                            base.options.onComplete();
                        })
                    });
                });
            } else {
                $('#' + base.options.overlayId).fadeOut(500, function () {
                    $('#' + base.options.overlayId).remove();
                    base.destroyContainers();
                    base.options.onComplete();
                });
            }
        }

        // Run initializer
        base.init();
    };

    //The default options
    $.queryLoader2.defaultOptions = {
        onComplete: function() {},
        backgroundColor: "#000",
        barColor: "#fff",
        overlayId: 'qLoverlay',
        barHeight: 1,
        percentage: false,
        deepSearch: true,
        completeAnimation: "fade",
        minimumTime: 500
    };

    //function binder
    $.fn.queryLoader2 = function(options){
        return this.each(function(){
            (new $.queryLoader2(this, options));
        });
    };
})(jQuery);

//HERE COMES THE IE SHITSTORM
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
/*
 * jQuery appear plugin
 *
 * Copyright (c) 2012 Andrey Sidorov
 * licensed under MIT license.
 *
 * https://github.com/morr/jquery.appear/
 *
 * Version: 0.3.3
 */
(function($) {
  var selectors = [];

  var check_binded = false;
  var check_lock = false;
  var defaults = {
    interval: 250,
    force_process: false
  }
  var $window = $(window);

  var $prior_appeared;

  function process() {
    check_lock = false;
    for (var index = 0; index < selectors.length; index++) {
      var $appeared = $(selectors[index]).filter(function() {
        return $(this).is(':appeared');
      });

      $appeared.trigger('appear', [$appeared]);

      if ($prior_appeared) {
        var $disappeared = $prior_appeared.not($appeared);
        $disappeared.trigger('disappear', [$disappeared]);
      }
      $prior_appeared = $appeared;
    }
  }

  // "appeared" custom filter
  $.expr[':']['appeared'] = function(element) {
    var $element = $(element);
    if (!$element.is(':visible')) {
      return false;
    }

    var window_left = $window.scrollLeft();
    var window_top = $window.scrollTop();
    var offset = $element.offset();
    var left = offset.left;
    var top = offset.top;

    if (top + $element.height() >= window_top &&
        top - ($element.data('appear-top-offset') || 0) <= window_top + $window.height() &&
        left + $element.width() >= window_left &&
        left - ($element.data('appear-left-offset') || 0) <= window_left + $window.width()) {
      return true;
    } else {
      return false;
    }
  }

  $.fn.extend({
    // watching for element's appearance in browser viewport
    appear: function(options) {
      var opts = $.extend({}, defaults, options || {});
      var selector = this.selector || this;
      if (!check_binded) {
        var on_check = function() {
          if (check_lock) {
            return;
          }
          check_lock = true;

          setTimeout(process, opts.interval);
        };

        $(window).scroll(on_check).resize(on_check);
        check_binded = true;
      }

      if (opts.force_process) {
        setTimeout(process, opts.interval);
      }
      selectors.push(selector);
      return $(selector);
    }
  });

  $.extend({
    // force elements's appearance check
    force_appear: function() {
      if (check_binded) {
        process();
        return true;
      };
      return false;
    }
  });
})(jQuery);

/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */
window.matchMedia=window.matchMedia||function(a){"use strict";var c,d=a.documentElement,e=d.firstElementChild||d.firstChild,f=a.createElement("body"),g=a.createElement("div");return g.id="mq-test-1",g.style.cssText="position:absolute;top:-100em",f.style.background="none",f.appendChild(g),function(a){return g.innerHTML='&shy;<style media="'+a+'"> #mq-test-1 { width: 42px; }</style>',d.insertBefore(f,e),c=42===g.offsetWidth,d.removeChild(f),{matches:c,media:a}}}(document);

/*! Respond.js v1.1.0: min/max-width media query polyfill. (c) Scott Jehl. MIT/GPLv2 Lic. j.mp/respondjs  */
(function(a){"use strict";function x(){u(!0)}var b={};a.respond=b,b.update=function(){},b.mediaQueriesSupported=a.matchMedia&&a.matchMedia("only all").matches,b.mediaQueriesSupported;var q,r,t,c=a.document,d=c.documentElement,e=[],f=[],g=[],h={},i=30,j=c.getElementsByTagName("head")[0]||d,k=c.getElementsByTagName("base")[0],l=j.getElementsByTagName("link"),m=[],n=function(){for(var b=0;l.length>b;b++){var c=l[b],d=c.href,e=c.media,f=c.rel&&"stylesheet"===c.rel.toLowerCase();d&&f&&!h[d]&&(c.styleSheet&&c.styleSheet.rawCssText?(p(c.styleSheet.rawCssText,d,e),h[d]=!0):(!/^([a-zA-Z:]*\/\/)/.test(d)&&!k||d.replace(RegExp.$1,"").split("/")[0]===a.location.host)&&m.push({href:d,media:e}))}o()},o=function(){if(m.length){var a=m.shift();v(a.href,function(b){p(b,a.href,a.media),h[a.href]=!0,setTimeout(function(){o()},0)})}},p=function(a,b,c){var d=a.match(/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi),g=d&&d.length||0;b=b.substring(0,b.lastIndexOf("/"));var h=function(a){return a.replace(/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,"$1"+b+"$2$3")},i=!g&&c;b.length&&(b+="/"),i&&(g=1);for(var j=0;g>j;j++){var k,l,m,n;i?(k=c,f.push(h(a))):(k=d[j].match(/@media *([^\{]+)\{([\S\s]+?)$/)&&RegExp.$1,f.push(RegExp.$2&&h(RegExp.$2))),m=k.split(","),n=m.length;for(var o=0;n>o;o++)l=m[o],e.push({media:l.split("(")[0].match(/(only\s+)?([a-zA-Z]+)\s?/)&&RegExp.$2||"all",rules:f.length-1,hasquery:l.indexOf("(")>-1,minw:l.match(/\(min\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||""),maxw:l.match(/\(max\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||"")})}u()},s=function(){var a,b=c.createElement("div"),e=c.body,f=!1;return b.style.cssText="position:absolute;font-size:1em;width:1em",e||(e=f=c.createElement("body"),e.style.background="none"),e.appendChild(b),d.insertBefore(e,d.firstChild),a=b.offsetWidth,f?d.removeChild(e):e.removeChild(b),a=t=parseFloat(a)},u=function(a){var b="clientWidth",h=d[b],k="CSS1Compat"===c.compatMode&&h||c.body[b]||h,m={},n=l[l.length-1],o=(new Date).getTime();if(a&&q&&i>o-q)return clearTimeout(r),r=setTimeout(u,i),void 0;q=o;for(var p in e)if(e.hasOwnProperty(p)){var v=e[p],w=v.minw,x=v.maxw,y=null===w,z=null===x,A="em";w&&(w=parseFloat(w)*(w.indexOf(A)>-1?t||s():1)),x&&(x=parseFloat(x)*(x.indexOf(A)>-1?t||s():1)),v.hasquery&&(y&&z||!(y||k>=w)||!(z||x>=k))||(m[v.media]||(m[v.media]=[]),m[v.media].push(f[v.rules]))}for(var B in g)g.hasOwnProperty(B)&&g[B]&&g[B].parentNode===j&&j.removeChild(g[B]);for(var C in m)if(m.hasOwnProperty(C)){var D=c.createElement("style"),E=m[C].join("\n");D.type="text/css",D.media=C,j.insertBefore(D,n.nextSibling),D.styleSheet?D.styleSheet.cssText=E:D.appendChild(c.createTextNode(E)),g.push(D)}},v=function(a,b){var c=w();c&&(c.open("GET",a,!0),c.onreadystatechange=function(){4!==c.readyState||200!==c.status&&304!==c.status||b(c.responseText)},4!==c.readyState&&c.send(null))},w=function(){var b=!1;try{b=new a.XMLHttpRequest}catch(c){b=new a.ActiveXObject("Microsoft.XMLHTTP")}return function(){return b}}();n(),b.update=n,a.addEventListener?a.addEventListener("resize",x,!1):a.attachEvent&&a.attachEvent("onresize",x)})(this);
