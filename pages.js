function page_js(targ,frame,frame1,frame2) {
  var page=this;
  if(targ=="about") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(gallery);
    };

    page.resize=function(){
      element_scale_inside(frame.find('.bg_img'), 1.78);
    };

    var scroll_pos = 0;

    if(pages_info.previous && pages_info.previous.type !== 'about'){
      frame.find('.page__header')
        .css({'opacity' : 0, 'y' : '-100%'})
        .delay(800).transition({'opacity' : 1, 'y' : 0}, 800);
      frame.find('.about__submenu')
        .css({'x' : '-100%'})
        .delay(1600).transition({'x' : '0'}, 800);
    }

    var gallery_frame = frame.find('.gallery_place');
    var gallery = gallery_frame.galleryInit({
      images: gallery_images,
      start_num: check_same_image(),
      previews: true,
      dots: true,
      previews_num: 1,
      loadComplete: function() {
        frame.find('.wait-load').remove();
        frame.find('.g_p.active')
          .prevAll().css({'visibility' : 'hidden', 'opacity' : 0}).end()
          .nextAll().each(function(i) {
          $(this).css({'visibility' : i < 3 ? 'visible' : 'hidden', 'opacity' : i < 3 ? 0.8 - 0.2 * i : 0});
        });
      },
      afterMove: function(num) {
        sessionStorage.gallery_image = gallery_images[num].src;

        frame.find('.g_p.active')
          .prevAll().css({'visibility' : 'hidden', 'opacity' : 0}).end()
          .nextAll().each(function(i) {
          $(this).css({'visibility' : i < 3 ? 'visible' : 'hidden', 'opacity' : i < 3 ? 0.8 - 0.2 * i : 0});
        });

        frame.find('.about__text-frame').addClass('folded');
      }
    });

    function check_same_image() {
      var cur_num = start_num;

      if(sessionStorage.gallery_image) {
        var name = sessionStorage.gallery_image;
        if(/d_/.test(name)) name = name.replace('d_', 'n_');
        else if(/n_/.test(name)) name = name.replace('n_', 'd_');

        if(!cur_num) {
          $.each(gallery_images, function(i, img) {
            if(img.src === name) cur_num = i;
          });
        }
      }
      sessionStorage.gallery_image = false;
      return cur_num;
    }

    frame
      .on('click', '.about__text-close', function() {
        $(this).parents('.about__text-frame').addClass('folded');
      })
      .on('click', '.about__text-frame.folded', function() {
        $(this).removeClass('folded');
      })
      .on('mousewheel', function(e, delta) {
        scroll_pos += delta;
        if(Math.abs(scroll_pos) > 5) {
          var arrow = scroll_pos > 0 ? 'right' : 'left';
          gallery.move(arrow);
          scroll_pos = 0;
        }
      });
  }())}
  if(targ=="advantages") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(carousel);
    };

    var scroll_pos = 0,
      scroll_av = true;

    var carousel = frame2.find('.carousel_frame').carouselInit({
      visible: 1,
      time: 1000,
      easing: easyInOut,
      beforeMove: function(num) {
        frame
          .find('.carousel_item').eq(num).setActive().end().end()
          .find('.advantages__submenu-item[data-targ="' + num + '"]').setActive();
      },
      afterMove: function() {
        // frame.find('.carousel_item.active').find('.advantages__item-scroll').data('plugin').reinitialise();
      }
    });

    frame
      .find('.carousel_item, .advantages__title, .advantages__submenu').css({'opacity' : 0, 'x' : '30%'});

    if(pages_info.previous && pages_info.previous.type === 'home') {
      console.log('advantages');
      white_frame.delay(500).transition({'y' : '-100%'}, 1000, function() {
        white_frame.hide();
        frame
          .find('.carousel_item').each(function(i) {
          $(this).delay(600 + 300 * i).transition({'opacity' : 1, 'x' : 0}, 1000);
        }).end()
          .find('.advantages__title').delay(100).transition({'opacity' : 1, 'x' : 0}, 1000).end()
          .find('.advantages__submenu').delay(300).transition({'opacity' : 1, 'x' : 0}, 1000);

      });
    } else {
      frame
        .find('.carousel_item').each(function(i) {
        $(this).delay(1200 + 300 * i).transition({'opacity' : 1, 'x' : 0}, 1000);
      }).end()
        .find('.advantages__title').delay(500).transition({'opacity' : 1, 'x' : 0}, 1000).end()
        .find('.advantages__submenu').delay(800).transition({'opacity' : 1, 'x' : 0}, 1000);

    }

    console.log(advantages_images);

    frame
      .on('click', '.advantages__submenu-item', function() {
        carousel.moveTo($(this).data('targ'));
      })
      .on('click', '.advantages__item-image', function() {
        if($(this).parents('.carousel_item').hasClass('active')) {
          scroll_av = false;
          open_popup_gallery({
            images: advantages_images,
            start_num: $(this).data('targ'),
            bg_style: 'cover',
            beforeClose: function(popup, popup_gallery) {
              carousel.moveTo(popup_gallery.getCurrent());
            },
            afterClose: function() {
              scroll_av = true;
            }
          });
        }
      })
      .on('click', '.carousel_item', function() {
        if(!$(this).hasClass('active')) {
          carousel.moveTo($(this).data('targ'));
        }
      })
      .on('mousewheel', function(e, delta) {
        if(scroll_av) {
          scroll_pos += delta;
          if(Math.abs(scroll_pos) > 5) {
            var arrow = scroll_pos > 0 ? 'left' : 'right';
            frame.find('.carousel_arrow.' + arrow).trigger('click');
            scroll_pos = 0;
          }
        }
      });

// frame.find('.carousel_item').each(function() {
//     var that = $(this),
//         cur_scroll = $(this).find('.advantages__item-scroll');
//
//     cur_scroll.data('plugin').setProperty('onScroll', function(pos) {
//         var is_active = that.hasClass('active');
//         console.log(cur_scroll.data('plugin').getMaxScrollPosition());
//     });
// });
  }())}
  if(targ=="calculator") {(function(){
    page.unset = function(current, next){
      frame.off();
      unloadPlugin(mortgage_calculator);
    };

    var $mortgage_preloader = frame.find('.mortgage__preloader'),
      temp_data;

    function generate_bank(bank, i) {

      return  '<div class="mortgage__bank" data-bank="' + i + '">' +
        '<div class="mortgage__bank-logo"><img src="/public/images/banks/' + bank.logo + '" /></div>' +
        '<div class="mortgage__bank-info">' +
        '<span>ставка</span>' +
        '<strong>' + (bank.percent + '').replace('.', ',') + '%</strong>' +
        '</div>' +
        '<div class="mortgage__bank-info">' +
        '<span>первоначальный взнос от</span>' +
        '<strong>' + bank.initial_payment + '%</strong>' +
        '</div>' +
        '<div class="mortgage__bank-info">' +
        '<span>срок до</span>' +
        '<strong>' + bank.time + '<i> лет</i></strong>' +
        '</div>' +
        '<div class="mortgage__bank-info wide">' +
        '<span>ежемесячный платеж</span>' +
        '<strong>' + addspace(bank.month_pay) + '<i> руб.</i></strong>' +
        '</div>' +
        '<div class="mortgage__bank-feedback"><span>Отправить заявку</span></div>' +
        '</div>';
    }

    var mortgage_calculator = frame.find('.calc_bg').mortgageCalculator({
      cost:{
        min: 100000,
        max: 16000000,
        current: 4000000,
        step: 50000,
        round: 1
      },
      banks: banks_data,
      onStart: function() {
        $mortgage_preloader.addClass('visible');
      },
      onUpdate:function(values){
        var html = '<div class="mortgage__banks">';

        console.log('123132');

        values.banks.forEach(function(bank, i) {
          html += generate_bank(bank, i);
        });

        html += '</div>';

        frame.find('.text_scroll').data('plugin').loadHtml(html, 0, function() {
          $mortgage_preloader.removeClass('visible');
        });

        temp_data = values;
      }
    });

    frame
      .on('click', '.mortgage__bank', function() {
        var bank = temp_data.banks[$(this).data('bank')];

        frame.openPopup({
          template: 'calculator',
          beforeOpen: function (popup) {
            popup
              .find('.mortgage__feedback-info .item')
              .filter('[data-targ="cost"]').find('.value').text(addspace(temp_data.cost) + ' руб.').end().end()
              .filter('[data-targ="initial"]').find('.value').text(addspace(temp_data.initial_payment) + ' руб.').end().end()
              .filter('[data-targ="time"]').find('.value').text(temp_data.time + ' ' + word_end4(temp_data.time)).end().end()
              .filter('[data-targ="bank"]').find('.value').text(bank.name).end().end()
              .filter('[data-targ="rate"]').find('.value').text(bank.percent + '%').end().end()
              .filter('[data-targ="payment"]').find('.value').text(addspace(bank.month_pay) + ' руб.').end().end().end()

              .find('.cost_input').val(addspace(temp_data.cost) + ' руб.').end()
              .find('.initial_payment_input').val(addspace(temp_data.initial_payment) + ' руб.').end()
              .find('.term_input').val(temp_data.time + ' ' + word_end4(temp_data.time)).end()
              .find('.bank_input').val(bank.name).end()
              .find('.percent_input').val(bank.percent + '%').end()
              .find('.payment_input').val(addspace(bank.month_pay) + ' руб.');

            form = popup.formInit({
              onSend:function(){
              },
              onSuccess:function(fields) {
              }
            });
          },
          afterClose: function (popup) {
            form = unloadPlugin(form);
          },
          loadAnimate: function(popup){
            popup
              .css({'display' : 'block', 'opacity' : 0}).transition({'opacity' : 1}, 500)
              .find('.feedback_bg').css({'opacity' : 0, 'y' : '20em'}).transition({'opacity' : 1, 'y' : 0}, 600);
          },
          unloadAnimate : function(popup, callback){
            popup
              .transitionStop(true).transition({'opacity' : 0}, 600, callback)
              .find('.feedback_bg').transitionStop(true).transition({'opacity' : 0, 'y' : '15em'}, 500);
          }
        });

      });
  }())}
  if(targ=="commercial-description") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(slideshow);
      unloadPlugin(scroll_controller);
    };

    page.resize=function(){
      element_scale_inside(frame.find('.home__slideshow-image'), 1.78, false, {'y' : 'bottom'});
      element_scale_inside(frame.find('.commercial-concept__resize'), 1.78, false);
      screen2_h = screen2[0].offsetHeight;
      move_screen_2(cur_pos);
      console.log(screen2[0].getBoundingClientRect());
    };

    var slideshow, scroll_controller,
      screen2 = frame.find('.home__screen.n2'),
      screen2_h,
      cur_pos = 0,
      concept_popup;

    init_content();

    function init_content() {

      /* SLIDESHOW */

      var images = gallery_images.map(function (item) {
          return item[0];
        }),
        interval = 7000;

      function slideshow_progress(delay) {
        frame2
          .find('.slideshow__controls-frame')
          .prepend('<div class="slideshow__progress"></div>')
          .find('.slideshow__progress').first().css({'transition-duration' : (interval + 1000) + 'ms'}).delay(delay).queue(function(next) {
          $(this).addClass('animating');
          next();
        })
          .nextAll('.slideshow__progress').remove();
      }

      slideshow = frame2.find('.home__slideshow-image').slideshowInit({
        slides: images,
        path: '',
        prefix: '',
        interval: interval,
        time: 1000,
        beforeChange: function (img, cur_number, old_number, direction) {
          img.css({'top': '100%', 'translate3d': 0});
          frame2.find('.slideshow__bullet[data-targ="' + cur_number + '"]').setActive();
          // frame.find('.home__slogans-frame').append('<div class="home__slogan"><div class="home__slogan-text">'+gallery_images[cur_number][1]+'</div></div>')
          //     .find('.home__slogan:last').css({'opacity' : 0, 'y' : '-80%'}).delay(500).transition({'opacity' : 1, 'y' : 0}, 500)
          //     .prevAll('.home__slogan').transitionStop(true).transition({'opacity' : 0}, 500, function () {
          //     $(this).remove();
          // });

          slideshow_progress(1000);
        },
        finishCSS: {'top' : '0%'}
      });

      slideshow_progress(10);

      frame
        .on('click', '.slideshow__bullet', function() {
          slideshow.loadImgNumber($(this).data('targ'));
        })
        .on('click', '.slideshow__arrow', function() {
          slideshow.loadImg($(this).data('targ'));
        });

      /* end SLIDESHOW */

      /* SCROLL CONTROLLER */

      var keyframes = [0, 1];

      var css_moving_elements = new init_css_moving_elements({
        elements: frame.find('.scroll_elements'),
        // keyframes: keyframes,
        elements_positions: {
          'home__screen-1':[
            {
              pos: 0,
              css: {
                top: '0%'
              }
            },{
              pos: 1,
              css: {
                top: '-100%'
              }
            }
          ],
          'home__col-2':[
            {
              pos: 0,
              css: {
                y: '0em'
              }
            },{
              pos: 1,
              css: {
                y: '-80em'
              }
            }
          ],
          'home__col-3':[
            {
              pos: 0,
              css: {
                y: '0em'
              }
            },{
              pos: 1,
              css: {
                y: '-60em'
              }
            }
          ],
          'home__text' : [
            {
              pos: 0,
              css: {
                x: '-6em',
                opacity : 0
              }
            },
            {
              pos: 0.3,
              css: {
                x: '0',
                opacity : 1
              }
            }
          ],
          'home__tile-content-1' : [
            {
              pos: 0,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.4,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.6,
              css: {
                y: '0em',
                opacity : 1
              }
            }
          ],
          'home__tile-content-3' : [
            {
              pos: 0,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.1,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.4,
              css: {
                y: '0em',
                opacity : 1
              }
            }
          ],
          'home__tile-content-5' : [
            {
              pos: 0,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.2,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.5,
              css: {
                y: '0em',
                opacity : 1
              }
            }
          ],
          'home__tile-content-6' : [
            {
              pos: 0,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.4,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.7,
              css: {
                y: '0em',
                opacity : 1
              }
            }
          ],
          'home__tile-content-7' : [
            {
              pos: 0,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.6,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.9,
              css: {
                y: '0em',
                opacity : 1
              }
            }
          ],
          'home__news-menu':[
            {
              pos: 0,
              css: {
                opacity: 0,
                y : '50%'
              }
            },
            {
              pos: 0.5,
              css: {
                opacity: 0,
                y : '50%'
              }
            },
            {
              pos: 0.8,
              css: {
                opacity: 1,
                y : '0%'
              }
            }
          ],
          'about__scroll-help':[
            {
              pos: 0,
              css: {
                opacity: 1
              }
            },
            {
              pos: 0.8,
              css: {
                opacity: 1
              }
            },
            {
              pos: 1,
              css: {
                opacity: 0
              }
            }
          ]
        }
      });

      scroll_controller = new init_scroll_controller({
        magnet: false,
        magnet_delta: 0.1,
        scroll_speed: 0.035,
        start_position: keyframes[0],
        events_area: frame,
        max_position: 1,
        animation_callback_before: function(pos) {

        },
        animation_callback_after: function(pos) {

        },
        animation_time: 1000,
        onMove: function(pos) {
          cur_pos = pos;
          css_moving_elements.move(pos);
          move_screen_2(pos);
          menu_btn.toggleClass('blue', pos < 0.2);
        }
      });

      frame
        .on('click', '.scroll-top__button', function() {
          scroll_controller.move({'target' : 0, 'time' : 800});
        })
        .on('click', '.home__scroll-help', function() {
          scroll_controller.move({'target' : 0.5, 'time' : 800});
        });

      /* end SCROLL CONTROLLER */
    }


    function move_screen_2(pos) {
      var next_pos = frame_h - (screen2_h + frame_h / 3) * pos,
        next_css = {};

      next_css[transitions_av ? 'y' : 'top'] = next_pos;
      screen2.css(next_css);
    }

    frame
      .on('click', '.commercial-description__open-concept', function() {
        concept_popup = frame.openPopup({
          template: 'commercial_concept',
          // class_name: 'documents__popup',
          beforeOpen: function(popup){
            popup
              .on('mouseenter', '.commercial-concept__item', function() {
                var b_nums = ($(this).data('targ') + '').split(',');

                popup.find('.commercial-concept__korpus').each(function() {
                  var that = $(this);
                  var dt = that.data('targ') + '';

                  console.log(dt, b_nums);

                  if($.inArray(dt, b_nums) + 1) {
                    that.addClass('active');
                  } else {
                    that.removeClass('active');
                  }
                });
              })
              .on('mouseleave', '.commercial-concept__item', function() {
                popup.find('.commercial-concept__korpus').removeClass('active');
              });
          },
          afterClose: function(popup){},
          loadAnimate: function(popup){
            popup.transitionShow(300).find('.commercial-concept__frame').removeClass('hidden');
            page.resize();
            frame.find('.to_drag').dragChildrens();
          },
          unloadAnimate : function(popup, callback){
            popup.transitionHide(800, callback).find('.commercial-concept__frame').addClass('hidden');
          }
        });
      })
      .on('click', '.commercial-description__open-offers', function(){
        frame.find('.plans__offers-frame').addClass('opened');
      })
      .on('click', '.plans__offers-close', function(){
        frame.find('.plans__offers-frame').removeClass('opened');
      });
  }())}
  if(targ=="commercial") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(param_search);
      plans_current_values.n = null;
    };

    page.resize = function() {
      element_scale_inside(frame.find('.plans__image'), 1.78);
      plan_check_size();
    };

    var param_search, svg_paper_bg, svg_paper_korp, svg_paper_floor, svg_paper_floor_minimap, svg_paper_quarter_minimap;
    var plans_info = frame.find('.plans_info');

    var plans_slider = frame.find('.plans__slider'),
      plans_frame = frame.find('.plans-frame'),
      korpus_frame = frame.find('.korpus-frame'),
      floor_frame = frame.find('.plans__floor-frame'),
      back_btn = frame.find('.plans__back'),
      bullets = frame.find('.slideshow__bullet'),
      stage = 0,
      stages_names = ['Выбор корпуса', 'Выбор этажа', 'Выбор помещения', 'Печать PDF'],
      stages_classes = ['opened_plans', 'opened_korpus', 'opened_floor', 'opened_apart'],
      apart_opacity = [0.2, 0.7],
      encode_string = '',
      korpus_reverse = false;

    var floor_rose_angle = korpus_frame.find('.plans__image-wrapper').data('floor-rose') || 0;

    plans_current_values.type = 'commercial';
    plans_current_values.floor_sel = floor_frame.find('.plans__floor-label');
    plans_current_values.apart_details = floor_frame.find('.apart_details_frame');
    plans_current_values.b = Number(plans_info.data('korpus'));
    plans_current_values.s = Number(plans_info.data('section'));
    plans_current_values.f = Number(plans_info.data('floor'));
    if(plans_info.data('flat')) plans_current_values.n = plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f + '-' + Number(plans_info.data('flat'));

    if(param_search_url){
      back_btn.data('url', param_search_url);
    }

    rotateWindrose(plans_frame.find('.windrose'), -150);

    test_json('commercial', function() {
      svg_paper_bg = plans_frame.find('.plans_map_cont').area2svg({
        'opacity': 0,
        'fill': '#01a8b7',
        'fill-opacity': 1,
        'stroke-opacity': 0,
        'width' : 1920,
        'height' : 1080,
        click: function (el) {
          if (el.data('active')) {
            plans_current_values.b = Number(el.alt);
            korpus_reverse = false;
            change_stage({'stage' : 1});
          }
        },
        mouseover: function (el) {
          if(el.data('active')) frame.find('.plans__korpus-bubble[data-targ="' + el.alt + '"]').trigger('mouseenter').addClass('hover');
        },
        mouseout: function (el) {
          if(el.data('active')) frame.find('.plans__korpus-bubble[data-targ="' + el.alt + '"]').trigger('mouseleave').removeClass('hover');
        },
        each: function (el) {
          el.attr({'fill': '#01a8b7'});
        }
      });

      frame.find('.plans__korpus-bubble').each(function() {
        var $bubble = $(this);
        var korp_num = $bubble.attr('data-targ');

        $bubble.html('' +
          '<div class="label flats-count"></div>' +
          '<div class="plans__korpus-bubble-num"><span>' + get_korp_num(korp_num) + '</span></div>'
        );
      });

      load_quarter_minimap();

      var search_hash=frame.find('.search_hash').data('hash');
      var search_values={};

      if(search_hash ) {
        var split_hash=search_hash.split('&');
        $.each(split_hash,function(index,value){
          var split_value=value.split('=');
          if(/active/.test(split_value[0])) {
            search_values[split_value[0]]=split_value[1];
          } else
          if(/-/.test(split_value[1])) {
            var split_value2=split_value[1].split('-');
            search_values[split_value[0]]={};
            search_values[split_value[0]].v_l=Number(split_value2[0]);
            search_values[split_value[0]].v_r=Number(split_value2[1]);
          } else {
            var split_value2 = split_value[1].split(',');
            search_values[split_value[0]]= split_value2.map(function(value){
              return isNaN(Number(value))? value : Number(value);
            });
          }
        })
      }

      param_search = frame2.searchInit({
        data: data.commercial.apartments,
        av_param:'fs',
        paramChange: function(val){
          encode_string = '';
          $.each(val, function(index, value){
            encode_string += index + '=';
            if(typeof value === 'string') {
              encode_string += value;
            } else
            if($.isPlainObject(value)) {
              encode_string += value.v_l + '-' + value.v_r;
            } else {
              encode_string += value.join();
            }
            encode_string += '&';
          });
          encode_string = encode_string.slice(0, -1);
          // sessionStorage['search_hash'] = encode_string;
          pjax.loadPage((pjax.getPathname() + '').split('?')[0] + '?' + encode_string, {'suppress_load' : true});
        },
        afterSearch: function(result) {
          if(stage === 0) filter_buildings(result);
          else if(stage === 1) filter_floors(result);
          else if(stage === 2) filter_aparts(result);
        },
        start_values: search_values,
        no_output: true,
        htmlNoLoad: true,
        pagination: 0
      });

      function change_stage(opt) {
        if(opt.delta) {
          stage += opt.delta;
        } else
        if(Number(opt.stage) === 0 || opt.stage) {
          stage = opt.stage;
        }

        switch (stage) {
          case 0:
            change_stage_details();
            break;
          case 1:
            load_korpus({b : plans_current_values.b, type : 'commercial', view : korpus_reverse? 'rev' : ''}, change_stage_details);
            break;
          case 2:
            load_floor(300, false, false, change_stage_details);
            break;
          case 3:
            load_floor_details();
            load_apart(300, false, change_stage_details);
          default:
            break;
        }

        if(!opt.no_history) change_url();
      }

      function change_stage_details() {
        param_search.forceSearch();

        plans_slider.transitionStop(true).transition({'x' : - (stage < 1 ? 0 : 1) * 100 + '%'}, 800, easyInOut);

        back_btn.toggleClass('hidden', stage === 0).find('.plans__back-label span').html(stages_names[stage - 1] ? stages_names[stage - 1] : '&nbsp;');
        bullets
          .filter('[data-targ="' + stage + '"]').attr('class', 'slideshow__bullet active')
          .prevAll('.slideshow__bullet').attr('class', 'slideshow__bullet').end()
          .nextAll('.slideshow__bullet').attr('class', 'slideshow__bullet inactive');

        frame.find('.plans__frame').attr('class', 'plans__frame ' + stages_classes[stage]);
      }

      function change_url() {
        var url = '/commercial';

        switch (stage) {
          case 1:
            url += '/korpus' + plans_current_values.b;
            break;
          case 2:
            url += '/korpus' + plans_current_values.b + '/section' + plans_current_values.s + '/floor' + plans_current_values.f;
            break;
          case 3:
            url += '/korpus' + plans_current_values.b + '/section' + plans_current_values.s + '/floor' + plans_current_values.f + '/flat' + data.commercial.apartments[plans_current_values.n].n;
          default:
            break;
        }
        pjax.loadPage(url + (encode_string ? '?' + encode_string : ''), {'suppress_load' : true});
      }

      function filter_buildings(result) {
        // =========why is it here?=======
        var active_bs = {};
        for(var i = 0, l = result.length; i < l; i ++) {
          var d = data.commercial.apartments[result[i]];
          if(!active_bs[d.b] ) active_bs[d.b] = 0;
          if (d.st == 1){
            active_bs[d.b] ++;
          }

        }
        // =============
        console.log('active_bs', active_bs);
        frame.find('.plans__korpus-bubble').each(function() {
          var $bubble = $(this);
          var dt = $bubble.data('targ');
          var count = active_bs[dt] || 0;    //through one place
          //var count = data.commercial.buildings[dt].at

          $bubble.toggleClass('active', !!count).find('.flats-count').text('Найдено: ' + count);
          svg_paper_bg.getByAlt(dt)[0].stop(true).animate(300).attr({'opacity' : count? 0.33 : 0, 'cursor' : 'pointer'});
          svg_paper_bg.getByAlt(dt)[0].data('active', count? 1 : 0);
        });
      }

      function filter_floors(result) {
        var active_floors = {};

        for(var i = 0, l = result.length; i < l; i ++) {
          var d = data.commercial.apartments[result[i]];
          if(d.b === plans_current_values.b) {
            if(!active_floors[d.s + '-' + d.f]) active_floors[d.s + '-' + d.f] = 0;
            active_floors[d.s + '-' + d.f] ++;
          }
        }
        console.log('active_floors',active_floors);
        svg_paper_korp.forEach(function(el) {
          var alt = el.alt;

          if(active_floors[alt]) {
            el.stop(true).animate(300).attr({'cursor' : 'pointer', 'opacity' : 0.33});
            el.at = active_floors[alt];
          } else {
            el.stop(true).animate(300).attr({'cursor' : 'default', 'opacity' : 0});
            el.at = 0;
          }
        });
      }


      function filter_aparts(result) {
        var apart_help = [0, 0],
          apart_help_html = '',
          apart_help_text = ['Другие помещения в продаже', 'Помещения в продаже'];

        svg_paper_floor.forEach(function(el) {
          var alt = el.alt;

          if(($.inArray(alt, result) + 1) && el.st) {
            if(el.st > 1 || el.st == 0){
              el.bottom.attr({'opacity' : '0'});
            } else {
              el.bottom.attr({'opacity' : apart_opacity[1]});
            }

            el.data('active', 1);
            apart_help[1] += 1;
          } else
          if(el.st) {
            el.bottom.attr({'opacity' : apart_opacity[0]});
            el.data('active', 0);
            apart_help[0] += 1;
          }
        });
        for(var i = 1; i >= 0; i --) {
          if(apart_help[i]) apart_help_html += '<div class="apart__help"><div class="apart__help-icon" style="opacity: ' + apart_opacity[i] + ';"></div><span>' + apart_help_text[i] + '</span></div>';
        }
        frame.find('.apart__help-frame').html(apart_help_html);
      }

      function load_korpus(data, callback) {
        preloader.show();
        $.ajax({
          data : data,
          url: '/ajax/korpus_load',
          success: function(response) {
            korpus_frame
              .html(response)
              .find('.wait-load').on('load', function() {
              preloader.hide();
              page.resize();
              floor_rose_angle = korpus_frame.find('.plans__image-wrapper').data('floor-rose');
              rotateWindrose(korpus_frame.find('.windrose'), korpus_frame.find('.plans__image-wrapper').data('rose'));
              callback();
            });
            load_korpus_map();
          }
        });
      }

      function load_korpus_map() {
        var floor_popup = korpus_frame.find('.floor-popup'),
          svg_paper_korp_frame = korpus_frame.find('.plans__image');
        var d = data.commercial.floors;
        svg_paper_korp = korpus_frame.find('.plans_map_cont').area2svg({
          'opacity': 0,
          'fill': '#01a8b7',
          'fill-opacity': 1,
          'stroke-opacity': 0,
          'width' : 1920,
          'height' : 1080,
          click: function (el) {
            if (el.at) {
              var spl = el.alt.split('-');
              plans_current_values.s = Number(spl[0]);
              plans_current_values.f = Number(spl[1]);
              change_stage({'stage' : 2});
            }
          },
          mouseover: function (el) {

            if(el.at) {
              var spl = el.alt.split('-');
              el.stop(true).animate(200).attr({'opacity' : 0.6});
              var box = el.bbox();
              var scale = svg_paper_korp_frame.width() / svg_paper_korp.width;
              floor_popup.addClass('active').css(box.x2 * 100 / svg_paper_korp.width < 70 ? {'top' : el.getSideCenters().ry * scale, 'left' : box.x2 * scale, 'margin-left' : 0} : {'top' : el.getSideCenters().ly * scale, 'left' : box.x * scale, 'margin-left' : '-27em'})
                .find('>.n2').text(spl[1] > 9 ? spl[1] : '0' + spl[1]).end()
                .find('.plans__floor-label-at .n2').text(d[plans_current_values.b+'-'+el.alt].at);//.text(el.at);
              if(d[plans_current_values.b+'-'+el.alt].at){
                floor_popup.find('.plans__floor-label-at .n1').show();
              } else {
                floor_popup.find('.plans__floor-label-at .n1').hide();
                floor_popup.find('.plans__floor-label-at .n2').html('<span class="com_is_sale_fl_pop">Продано</span>');
              }
            }
          },
          mouseout: function (el) {
            if(el.at) {
              el.stop(true).animate(200).attr({'opacity' : 0.33});
            }
            floor_popup.removeClass('active');
          },
          each: function (el) {
            var section_num = el.alt.split('-')[0];
            el.attr({'fill': (section_num % 2)? '#01a8b7' : '#c1d72e'});
          }
        });
      }

      function load_floor(time, no_history, directions, callback) {
        plans_current_values.n=null;
        // if (apart_zoom) {
        //     apart_zoom.setOff();
        // }
        load_floor_details();

        frame.find('.plan_frame.n0 .plan_frame_centrer_position').transitionStop(true).transition(get_floor_css(directions,0,1), time, function() {
          load_floor_map($(this), time, directions, callback);
        });

        // frame.find('.floor-popup').remove();
        // if (!no_history) {
        //     change_url('floor');
        // }
      }

      function load_floor_map(fr, time, directions, callback) {
        var floor_id = plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f,
          current_html = fr.data('targ'),
          d1 = $.Deferred();

        preloader.show();

        $.when(d1).done(function() {
          preloader.hide();
          // plans_current_values.apart_details.removeClass('active');
          fr.css(get_floor_css(directions,null,-1)).transition(get_floor_css(null,1,0), time);
          if(callback) callback();
        });

        if(floor_id == current_html) {
          d1.resolve();
        } else {
          fr.data('targ', floor_id).load('/hydra/com/floors/' + floor_id + '.html', function() {
            var apart_popups_html='';
            var img=fr.find('.floor_map');
            var w=img.attr('width');
            var h=img.attr('height');
            img.on('load',function() {
              $(this).off('load');
              d1.resolve();
            });
            svg_paper_floor = fr.find('.floor_map_cont').area2svg({
              'opacity': 0,
              'width': w,
              'height': h,
              'cursor': 'default',
              click: function (el) {
                if (el.st == 1) {
                  plans_current_values.n = el.alt;
                  change_stage({'stage' : 3});
                }
              },
              mouseover: function (el) {
                if(!plans_current_values.n) {
                  if (el.st == 1) {
                    el.bottom.attr({'fill' : '#01a8b7'});
                    fr.find('.apart__bubble.n'+el.alt).addClass('hover');
                  }
                  load_apart_details(el.alt);
                }
              },
              mouseout: function (el) {
                if (el.st == 1) {
                  el.bottom.attr({'fill' : '#c1d72e'});
                  fr.find('.apart__bubble.n'+el.alt).removeClass('hover');
                }
                plans_current_values.apart_details.removeClass('active');
              },
              each: function (el) {
                var d = data.commercial.apartments[el.alt];
                if (!d || d.st != 1) {
                  if (!d) {
                    d = {};
                    d.st = 0;
                    console.log('null data at '+el.alt);
                  }
                  el.bottom.attr({'opacity': 0});
                } else {
                  el.bottom.attr({'opacity' : 0.2, 'fill' : '#c1d72e'});
                  el.attr({'cursor': 'pointer'});
                  var box = el.getCentroid();
                  apart_popups_html += '<div class="apart__bubble css_ani n' + el.alt + '" style="top:' + (100*box.cy/h) + '%; left:' + (100 * box.cx / w) + '%;"></div>';
                }
                el.st = d.st;
              }
            });
            fr.find('.floor_map').after(apart_popups_html);
            apart_popups_html=null;
          });
          load_floor_minimap();
        }
      }

      function load_quarter_minimap() {
        svg_paper_quarter_minimap = frame.find('.quarter_map_cont').area2svg({
          'opacity': 0,
          'fill': '#01a8b7',
          'width': 360,
          'height': 260,
          'cursor': 'default',
          click: function (el) {},
          mouseover: function (el) {},
          mouseout: function (el) {},
          each: function (el) {

          }
        });
      }

      function update_quarter_minimap() {
        svg_paper_quarter_minimap.forEach(function(el) {
          if(el.alt === plans_current_values.b + '-' + plans_current_values.s) el.attr({'opacity' : 1, 'fill' : '#01a8b7'});
          else el.attr({'opacity' : 0});
        });
      }

      function load_floor_minimap(callback) {
        callback = callback || function(){};
        var floor_id = plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f,
          fr = frame.find('.floor_minimap_frame');
        var current_html = fr.data('targ');

        if(current_html !== floor_id) {
          fr.data('targ', current_html).load('/hydra/com/floors/' + floor_id + '.html', function() {
            var img = fr.find('.floor_map');
            var w = img.attr('width');
            var h = img.attr('height');
            svg_paper_floor_minimap = fr.find('.floor_map_cont').area2svg({
              'opacity': 0,
              'fill': '#01a8b7',
              'width': w,
              'height': h,
              'cursor': 'default',
              click: function (el) {},
              mouseover: function (el) {},
              mouseout: function (el) {},
              each: function (el) {

              }
            });
            callback();
          });
        } else {
          callback();
        }
      }

      function load_floor_details() {
        rotateWindrose(floor_frame.find('.windrose'), floor_rose_angle, 300);

        if (!data.commercial.floors[plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f]) {
          plans_current_values.f = get_exist_floor(plans_current_values.f, -1);
        }
        if (data.commercial.floors[plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f].ta === 0) {
          plans_current_values.f = get_near_floor(plans_current_values.f);
        }
        // test_next_btn(plans_current_values.sect_sel.find('.sect_left'), get_closest_section(plans_current_values.s, -1));
        // test_next_btn(plans_current_values.sect_sel.find('.sect_right'), get_closest_section(plans_current_values.s, 1));
        test_next_btn(plans_current_values.floor_sel.find('.floor_down'), get_closest_floor(plans_current_values.f, -1));
        test_next_btn(plans_current_values.floor_sel.find('.floor_up'), get_closest_floor(plans_current_values.f, 1));
        //
        // plans_current_values.sect_sel.find('.val').text(plans_current_values.s);
        plans_current_values.floor_sel.find('.n2').text(plans_current_values.f > 9 ? plans_current_values.f : '0' + plans_current_values.f);

        update_quarter_minimap();
      }
      var not_sale_text = ['Скоро в продаже', 'В продаже', 'Забронировано', 'Продано'];
      function load_apart_details(alt) {
        var d = data.commercial.apartments[alt];
        plans_current_values.apart_details.addClass('active');
        if (d && d.st==1) {
          plans_current_values.apart_details.removeClass('not-sale')
            .find('[data-targ="n"] .val').text(d.tn).end()
            .find('[data-targ="rc"] .val').text(d.rc).end()
            .find('[data-targ="sq"] .val').html(d.sq).end()
            .find('[data-targ="tc"] .val').text(Math.round(d.tc / 10000) / 100);
        } else {
          plans_current_values.apart_details.addClass('not-sale');
          plans_current_values.apart_details.find('.not_sale_text').text(not_sale_text[d.st]);
        }
      }

      function load_apart_img(img_frame, src, time, callback) {
        preloader.show();
        img_frame.transitionStop(true).transition({'opacity':0},time,function(){
          img_frame.html('<img class="apart_img" src="'+src+'" />')
            .find('.apart_img').css({'translate3d':0}).on('load',function() {
            preloader.hide();
            img_frame.transitionStop(true).transition({'opacity':1},time);
            $(this).off('load');
            if(callback) callback();
          });
        })
      }
      function load_apart(time, no_history, callback) {
        load_apart_details(plans_current_values.n);
        load_apart_img(frame.find('.plan_frame.n1 .plan_frame_centrer_position'), '/hydra/com/apts/'+plans_current_values.n+'.png', time, callback);
        load_floor_minimap(function() {
          svg_paper_floor_minimap.forEach(function(el) {
            el.bottom.attr({'opacity' : (el.alt === plans_current_values.n) ? 0.8 : 0});
          });
        });
        frame.find('.plans_close').data('targ', param_search_url);
        if (!no_history) {
          change_url('flat');
        }
        frame.find('.fav_btn').toggleClass('active', checkFavourite(plans_current_values.n));
      }


      function get_floor_css(directions,opacity,direction) {
        var css = {};
        if(directions) {
          css = get_transition_css(direction*10*directions[0]+'%',direction*10*directions[1]+'%');
        } else
        if(direction == 0) {
          css = get_transition_css('0%','0%');
        }
        if(opacity !== null) {
          css.opacity = opacity;
        }
        return css;
      }

      function test_next_btn(btn,val) {
        if (val==null) {
          btn.removeClass('active');
        } else {
          btn.addClass('active').data('targ',val).find('span').text(val < 10 ? '0' + val : val);
        }
      }
      function get_exist_floor(floor,delta) {
        floor+=delta;
        if (data.commercial.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor]) {
          return floor;
        } else {
          return get_exist_floor(floor,delta);
        }
      }
      function get_closest_floor(floor,delta,i) {
        floor += delta;
        //console.log(floor);
        if(i == undefined) {
          i=0;
        } else {
          i++;
        }
        if (i>20) {
          return null;
        } else
        if (data.commercial.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor] && data.commercial.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor].ta!=0) {
          return floor;
        } else {
          return get_closest_floor(floor,delta,i)
        }
      }
      function get_near_floor(floor) {
        var floor_down=get_closest_floor(floor, -1);
        var floor_up=get_closest_floor(floor, 1);
        var result=null;
        if((floor_up && !floor_down) || (floor_up && floor_down && floor_up-floor<floor-floor_down)) {
          result=floor_up;
        } else
        if(floor_down) {
          result=floor_down;
        }
        return result;
      }
      function get_closest_section(section,delta,i) {
        section+=delta;
        if(i==undefined) {
          i=0;
        } else {
          i++;
        }
        if (i>20) {
          return null;
        } else
        if (data.commercial.sections[plans_current_values.b+'-'+section] && data.commercial.sections[plans_current_values.b+'-'+section].ta!=0) {
          return section;
        } else {
          return get_closest_section(section,delta,i)
        }
      }
      function load_floor_animation(options) {
        var direction_floor=0;
        var direction_section=0;
        if(options.floor!=undefined) {
          var floor_next=Number(options.floor);
          if(floor_next<plans_current_values.f) {
            direction_floor=-1
          } else {
            direction_floor=1;
          }
          plans_current_values.f=floor_next;
        }
        if(options.section!=undefined) {
          var section_next=Number(options.section);
          if(section_next>plans_current_values.s) {
            direction_section=-1
          } else {
            direction_section=1;
          }
          plans_current_values.s=section_next;
        }
        load_floor(300,null,[direction_floor,direction_section], param_search.forceSearch);
        change_url();
      }


      if(plans_info.data('stage')) {
        change_stage({'stage' : plans_info.data('stage'), 'no_history' : true});
      }

      frame
        .on('click', '.search_buttons_title', function() {
          var that = $(this);

          that
            .toggleClass('active')
            .siblings('.search_buttons_hidden').transitionToggleHeight(that.hasClass('active'), 500, function() {
            frame.find('.plans__filters').data('plugin').reinitialise({fix_position:true});
          });
        })
        .on('click', '.plans__korpus-bubble', function() {
          if($(this).hasClass('active')) {
            plans_current_values.b = Number($(this).data('targ'));
            change_stage({'stage' : 1});
          }
        })
        .on('mouseenter', '.plans__korpus-bubble', function() {
          if($(this).hasClass('active')) {
            svg_paper_bg.getByAlt($(this).data('targ'))[0].stop(true).animate(100).attr({'fill' : '#ffffff'});
          }
        })
        .on('mouseleave', '.plans__korpus-bubble', function() {
          if($(this).hasClass('active')) {
            svg_paper_bg.getByAlt($(this).data('targ'))[0].stop(true).animate(100).attr({'fill' : '#01a8b7'});
          }
        })
        .on('click', '.plans__back', function(){
          var url = $(this).data('url');
          if(url){
            pjax.loadPage(url);
          } else {
            change_stage({'delta' : -1});
          }
        })
        .on('click', '.slideshow__bullet', function() {
          if(!$(this).hasClass('active') && !$(this).hasClass('inactive')) {
            change_stage({'stage' : $(this).data('targ')});
          }
        })
        .on('click', '.floor_down.active, .floor_up.active', function() {
          load_floor_animation({
            floor:$(this).data('targ')
          });
        })
        .on('click', '.pdf_btn', function() {
          window.open('/assets/php/pdf.php?t=c&id='+plans_current_values.n, '_blank');
        })
        .on('click', '.plans__rotate-button', function(){
          korpus_reverse = !korpus_reverse;
          korpus_frame.transitionStop().transition({'opacity' : '0'}, 500, function(){
            load_korpus({
              b : plans_current_values.b,
              type : 'commercial',
              view : korpus_reverse? 'rev' : ''
            }, function(){
              korpus_frame.transitionStop().transition({'opacity' : '1'}, 500);
              change_stage_details();
            });
          });
        });
    });

    function plan_check_size() {
      frame.find('.plan_frame_centrer').each(function(){
        var fr = $(this);
        var fr2 = fr.parent();
        var apart_ratio = $(this).data('targ')||1;
        var fr2_w=fr2.width();
        var fr2_h=fr2.height();
        var plan_size = Math.min(fr2_w / apart_ratio, fr2_h);
        fr.css({'width': plan_size * apart_ratio, 'height': plan_size, 'margin-top': 0.5 * (fr2_h-plan_size), 'margin-left':0.5 * (fr2_w-plan_size * apart_ratio)});
      })
    }

    frame
      .on('click', '.plans__offers-button', function() {
        $(this).parents('.plans__offers-frame').addClass('opened');
      })
      .on('click', '.plans__offers-close', function() {
        $(this).parents('.plans__offers-frame').removeClass('opened');
      });
  }())}
  if(targ=="commercial.js_03_06_2019") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(param_search);
      plans_current_values.n = null;
    };

    page.resize = function() {
      element_scale_inside(frame.find('.plans__image'), 1.78);
      plan_check_size();
    };

    var param_search, svg_paper_bg, svg_paper_korp, svg_paper_floor, svg_paper_floor_minimap, svg_paper_quarter_minimap;
    var plans_info = frame.find('.plans_info');

    var plans_slider = frame.find('.plans__slider'),
      plans_frame = frame.find('.plans-frame'),
      korpus_frame = frame.find('.korpus-frame'),
      floor_frame = frame.find('.plans__floor-frame'),
      back_btn = frame.find('.plans__back'),
      bullets = frame.find('.slideshow__bullet'),
      stage = 0,
      stages_names = ['Выбор корпуса', 'Выбор этажа', 'Выбор помещения', 'Печать PDF'],
      stages_classes = ['opened_plans', 'opened_korpus', 'opened_floor', 'opened_apart'],
      apart_opacity = [0.2, 0.7],
      encode_string = '',
      korpus_reverse = false;

    var floor_rose_angle = korpus_frame.find('.plans__image-wrapper').data('floor-rose') || 0;

    plans_current_values.type = 'commercial';
    plans_current_values.floor_sel = floor_frame.find('.plans__floor-label');
    plans_current_values.apart_details = floor_frame.find('.apart_details_frame');
    plans_current_values.b = Number(plans_info.data('korpus'));
    plans_current_values.s = Number(plans_info.data('section'));
    plans_current_values.f = Number(plans_info.data('floor'));
    if(plans_info.data('flat')) plans_current_values.n = plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f + '-' + Number(plans_info.data('flat'));

    if(param_search_url){
      back_btn.data('url', param_search_url);
    }

    rotateWindrose(plans_frame.find('.windrose'), -150);

    test_json('commercial', function() {
      svg_paper_bg = plans_frame.find('.plans_map_cont').area2svg({
        'opacity': 0,
        'fill': '#01a8b7',
        'fill-opacity': 1,
        'stroke-opacity': 0,
        'width' : 1920,
        'height' : 1080,
        click: function (el) {
          if (el.data('active')) {
            plans_current_values.b = Number(el.alt);
            korpus_reverse = false;
            change_stage({'stage' : 1});
          }
        },
        mouseover: function (el) {
          if(el.data('active')) frame.find('.plans__korpus-bubble[data-targ="' + el.alt + '"]').trigger('mouseenter').addClass('hover');
        },
        mouseout: function (el) {
          if(el.data('active')) frame.find('.plans__korpus-bubble[data-targ="' + el.alt + '"]').trigger('mouseleave').removeClass('hover');
        },
        each: function (el) {
          el.attr({'fill': '#01a8b7'});
        }
      });

      frame.find('.plans__korpus-bubble').each(function() {
        var $bubble = $(this);
        var korp_num = $bubble.attr('data-targ');

        $bubble.html('' +
          '<div class="label flats-count"></div>' +
          '<div class="plans__korpus-bubble-num"><span>' + get_korp_num(korp_num) + '</span></div>'
        );
      });

      load_quarter_minimap();

      var search_hash=frame.find('.search_hash').data('hash');
      var search_values={};

      if(search_hash ) {
        var split_hash=search_hash.split('&');
        $.each(split_hash,function(index,value){
          var split_value=value.split('=');
          if(/active/.test(split_value[0])) {
            search_values[split_value[0]]=split_value[1];
          } else
          if(/-/.test(split_value[1])) {
            var split_value2=split_value[1].split('-');
            search_values[split_value[0]]={};
            search_values[split_value[0]].v_l=Number(split_value2[0]);
            search_values[split_value[0]].v_r=Number(split_value2[1]);
          } else {
            var split_value2 = split_value[1].split(',');
            search_values[split_value[0]]= split_value2.map(function(value){
              return isNaN(Number(value))? value : Number(value);
            });
          }
        })
      }

      param_search = frame2.searchInit({
        data: data.commercial.apartments,
        av_param:'fs',
        paramChange: function(val){
          encode_string = '';
          $.each(val, function(index, value){
            encode_string += index + '=';
            if(typeof value === 'string') {
              encode_string += value;
            } else
            if($.isPlainObject(value)) {
              encode_string += value.v_l + '-' + value.v_r;
            } else {
              encode_string += value.join();
            }
            encode_string += '&';
          });
          encode_string = encode_string.slice(0, -1);
          // sessionStorage['search_hash'] = encode_string;
          pjax.loadPage((pjax.getPathname() + '').split('?')[0] + '?' + encode_string, {'suppress_load' : true});
        },
        afterSearch: function(result) {
          if(stage === 0) filter_buildings(result);
          else if(stage === 1) filter_floors(result);
          else if(stage === 2) filter_aparts(result);
        },
        start_values: search_values,
        no_output: true,
        htmlNoLoad: true,
        pagination: 0
      });

      function change_stage(opt) {
        if(opt.delta) {
          stage += opt.delta;
        } else
        if(Number(opt.stage) === 0 || opt.stage) {
          stage = opt.stage;
        }

        switch (stage) {
          case 0:
            change_stage_details();
            break;
          case 1:
            load_korpus({b : plans_current_values.b, type : 'commercial', view : korpus_reverse? 'rev' : ''}, change_stage_details);
            break;
          case 2:
            load_floor(300, false, false, change_stage_details);
            break;
          case 3:
            load_floor_details();
            load_apart(300, false, change_stage_details);
          default:
            break;
        }

        if(!opt.no_history) change_url();
      }

      function change_stage_details() {
        param_search.forceSearch();

        plans_slider.transitionStop(true).transition({'x' : - (stage < 1 ? 0 : 1) * 100 + '%'}, 800, easyInOut);

        back_btn.toggleClass('hidden', stage === 0).find('.plans__back-label span').html(stages_names[stage - 1] ? stages_names[stage - 1] : '&nbsp;');
        bullets
          .filter('[data-targ="' + stage + '"]').attr('class', 'slideshow__bullet active')
          .prevAll('.slideshow__bullet').attr('class', 'slideshow__bullet').end()
          .nextAll('.slideshow__bullet').attr('class', 'slideshow__bullet inactive');

        frame.find('.plans__frame').attr('class', 'plans__frame ' + stages_classes[stage]);
      }

      function change_url() {
        var url = '/commercial';

        switch (stage) {
          case 1:
            url += '/korpus' + plans_current_values.b;
            break;
          case 2:
            url += '/korpus' + plans_current_values.b + '/section' + plans_current_values.s + '/floor' + plans_current_values.f;
            break;
          case 3:
            url += '/korpus' + plans_current_values.b + '/section' + plans_current_values.s + '/floor' + plans_current_values.f + '/flat' + data.commercial.apartments[plans_current_values.n].n;
          default:
            break;
        }
        pjax.loadPage(url + (encode_string ? '?' + encode_string : ''), {'suppress_load' : true});
      }

      function filter_buildings(result) {
        // =========why is it here?=======
        var active_bs = {};
        for(var i = 0, l = result.length; i < l; i ++) {
          var d = data.commercial.apartments[result[i]];
          if(!active_bs[d.b] ) active_bs[d.b] = 0;
          if (d.st == 1){
            active_bs[d.b] ++;
          }

        }
        // =============
        console.log('active_bs', active_bs);
        frame.find('.plans__korpus-bubble').each(function() {
          var $bubble = $(this);
          var dt = $bubble.data('targ');
          var count = active_bs[dt] || 0;    //through one place
          //var count = data.commercial.buildings[dt].at

          $bubble.toggleClass('active', !!count).find('.flats-count').text('Найдено: ' + count);
          svg_paper_bg.getByAlt(dt)[0].stop(true).animate(300).attr({'opacity' : count? 0.33 : 0, 'cursor' : 'pointer'});
          svg_paper_bg.getByAlt(dt)[0].data('active', count? 1 : 0);
        });
      }

      function filter_floors(result) {
        var active_floors = {};

        for(var i = 0, l = result.length; i < l; i ++) {
          var d = data.commercial.apartments[result[i]];
          if(d.b === plans_current_values.b) {
            if(!active_floors[d.s + '-' + d.f]) active_floors[d.s + '-' + d.f] = 0;
            active_floors[d.s + '-' + d.f] ++;
          }
        }
        console.log('active_floors',active_floors);
        svg_paper_korp.forEach(function(el) {
          var alt = el.alt;

          if(active_floors[alt]) {
            el.stop(true).animate(300).attr({'cursor' : 'pointer', 'opacity' : 0.33});
            el.at = active_floors[alt];
          } else {
            el.stop(true).animate(300).attr({'cursor' : 'default', 'opacity' : 0});
            el.at = 0;
          }
        });
      }


      function filter_aparts(result) {
        var apart_help = [0, 0],
          apart_help_html = '',
          apart_help_text = ['Другие помещения в продаже', 'Помещения в продаже'];

        svg_paper_floor.forEach(function(el) {
          var alt = el.alt;

          if(($.inArray(alt, result) + 1) && el.st) {
            if(el.st > 1 || el.st == 0){
              el.bottom.attr({'opacity' : '0'});
            } else {
              el.bottom.attr({'opacity' : apart_opacity[1]});
            }

            el.data('active', 1);
            apart_help[1] += 1;
          } else
          if(el.st) {
            el.bottom.attr({'opacity' : apart_opacity[0]});
            el.data('active', 0);
            apart_help[0] += 1;
          }
        });
        for(var i = 1; i >= 0; i --) {
          if(apart_help[i]) apart_help_html += '<div class="apart__help"><div class="apart__help-icon" style="opacity: ' + apart_opacity[i] + ';"></div><span>' + apart_help_text[i] + '</span></div>';
        }
        frame.find('.apart__help-frame').html(apart_help_html);
      }

      function load_korpus(data, callback) {
        preloader.show();
        $.ajax({
          data : data,
          url: '/ajax/korpus_load',
          success: function(response) {
            korpus_frame
              .html(response)
              .find('.wait-load').on('load', function() {
              preloader.hide();
              page.resize();
              floor_rose_angle = korpus_frame.find('.plans__image-wrapper').data('floor-rose');
              rotateWindrose(korpus_frame.find('.windrose'), korpus_frame.find('.plans__image-wrapper').data('rose'));
              callback();
            });
            load_korpus_map();
          }
        });
      }

      function load_korpus_map() {
        var floor_popup = korpus_frame.find('.floor-popup'),
          svg_paper_korp_frame = korpus_frame.find('.plans__image');
        var d = data.commercial.floors;
        svg_paper_korp = korpus_frame.find('.plans_map_cont').area2svg({
          'opacity': 0,
          'fill': '#01a8b7',
          'fill-opacity': 1,
          'stroke-opacity': 0,
          'width' : 1920,
          'height' : 1080,
          click: function (el) {
            if (el.at) {
              var spl = el.alt.split('-');
              plans_current_values.s = Number(spl[0]);
              plans_current_values.f = Number(spl[1]);
              change_stage({'stage' : 2});
            }
          },
          mouseover: function (el) {

            if(el.at) {
              var spl = el.alt.split('-');
              el.stop(true).animate(200).attr({'opacity' : 0.6});
              var box = el.bbox();
              var scale = svg_paper_korp_frame.width() / svg_paper_korp.width;
              floor_popup.addClass('active').css(box.x2 * 100 / svg_paper_korp.width < 70 ? {'top' : el.getSideCenters().ry * scale, 'left' : box.x2 * scale, 'margin-left' : 0} : {'top' : el.getSideCenters().ly * scale, 'left' : box.x * scale, 'margin-left' : '-27em'})
                .find('>.n2').text(spl[1] > 9 ? spl[1] : '0' + spl[1]).end()
                .find('.plans__floor-label-at .n2').text(d[plans_current_values.b+'-'+el.alt].at);//.text(el.at);
            }
          },
          mouseout: function (el) {
            if(el.at) {
              el.stop(true).animate(200).attr({'opacity' : 0.33});
            }
            floor_popup.removeClass('active');
          },
          each: function (el) {
            var section_num = el.alt.split('-')[0];
            el.attr({'fill': (section_num % 2)? '#01a8b7' : '#c1d72e'});
          }
        });
      }

      function load_floor(time, no_history, directions, callback) {
        plans_current_values.n=null;
        // if (apart_zoom) {
        //     apart_zoom.setOff();
        // }
        load_floor_details();

        frame.find('.plan_frame.n0 .plan_frame_centrer_position').transitionStop(true).transition(get_floor_css(directions,0,1), time, function() {
          load_floor_map($(this), time, directions, callback);
        });

        // frame.find('.floor-popup').remove();
        // if (!no_history) {
        //     change_url('floor');
        // }
      }

      function load_floor_map(fr, time, directions, callback) {
        var floor_id = plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f,
          current_html = fr.data('targ'),
          d1 = $.Deferred();

        preloader.show();

        $.when(d1).done(function() {
          preloader.hide();
          // plans_current_values.apart_details.removeClass('active');
          fr.css(get_floor_css(directions,null,-1)).transition(get_floor_css(null,1,0), time);
          if(callback) callback();
        });

        if(floor_id == current_html) {
          d1.resolve();
        } else {
          fr.data('targ', floor_id).load('/hydra/com/floors/' + floor_id + '.html', function() {
            var apart_popups_html='';
            var img=fr.find('.floor_map');
            var w=img.attr('width');
            var h=img.attr('height');
            img.on('load',function() {
              $(this).off('load');
              d1.resolve();
            });
            svg_paper_floor = fr.find('.floor_map_cont').area2svg({
              'opacity': 0,
              'width': w,
              'height': h,
              'cursor': 'default',
              click: function (el) {
                if (el.st == 1) {
                  plans_current_values.n = el.alt;
                  change_stage({'stage' : 3});
                }
              },
              mouseover: function (el) {
                if(!plans_current_values.n) {
                  if (el.st == 1) {
                    el.bottom.attr({'fill' : '#01a8b7'});
                    fr.find('.apart__bubble.n'+el.alt).addClass('hover');
                  }
                  load_apart_details(el.alt);
                }
              },
              mouseout: function (el) {
                if (el.st == 1) {
                  el.bottom.attr({'fill' : '#c1d72e'});
                  fr.find('.apart__bubble.n'+el.alt).removeClass('hover');
                }
                plans_current_values.apart_details.removeClass('active');
              },
              each: function (el) {
                var d = data.commercial.apartments[el.alt];
                if (!d || d.st != 1) {
                  if (!d) {
                    d = {};
                    d.st = 0;
                    console.log('null data at '+el.alt);
                  }
                  el.bottom.attr({'opacity': 0});
                } else {
                  el.bottom.attr({'opacity' : 0.2, 'fill' : '#c1d72e'});
                  el.attr({'cursor': 'pointer'});
                  var box = el.getCentroid();
                  apart_popups_html += '<div class="apart__bubble css_ani n' + el.alt + '" style="top:' + (100*box.cy/h) + '%; left:' + (100 * box.cx / w) + '%;"></div>';
                }
                el.st = d.st;
              }
            });
            fr.find('.floor_map').after(apart_popups_html);
            apart_popups_html=null;
          });
          load_floor_minimap();
        }
      }

      function load_quarter_minimap() {
        svg_paper_quarter_minimap = frame.find('.quarter_map_cont').area2svg({
          'opacity': 0,
          'fill': '#01a8b7',
          'width': 360,
          'height': 260,
          'cursor': 'default',
          click: function (el) {},
          mouseover: function (el) {},
          mouseout: function (el) {},
          each: function (el) {

          }
        });
      }

      function update_quarter_minimap() {
        svg_paper_quarter_minimap.forEach(function(el) {
          if(el.alt === plans_current_values.b + '-' + plans_current_values.s) el.attr({'opacity' : 1, 'fill' : '#01a8b7'});
          else el.attr({'opacity' : 0});
        });
      }

      function load_floor_minimap(callback) {
        callback = callback || function(){};
        var floor_id = plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f,
          fr = frame.find('.floor_minimap_frame');
        var current_html = fr.data('targ');

        if(current_html !== floor_id) {
          fr.data('targ', current_html).load('/hydra/com/floors/' + floor_id + '.html', function() {
            var img = fr.find('.floor_map');
            var w = img.attr('width');
            var h = img.attr('height');
            svg_paper_floor_minimap = fr.find('.floor_map_cont').area2svg({
              'opacity': 0,
              'fill': '#01a8b7',
              'width': w,
              'height': h,
              'cursor': 'default',
              click: function (el) {},
              mouseover: function (el) {},
              mouseout: function (el) {},
              each: function (el) {

              }
            });
            callback();
          });
        } else {
          callback();
        }
      }

      function load_floor_details() {
        rotateWindrose(floor_frame.find('.windrose'), floor_rose_angle, 300);

        if (!data.commercial.floors[plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f]) {
          plans_current_values.f = get_exist_floor(plans_current_values.f, -1);
        }
        if (data.commercial.floors[plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f].ta === 0) {
          plans_current_values.f = get_near_floor(plans_current_values.f);
        }
        // test_next_btn(plans_current_values.sect_sel.find('.sect_left'), get_closest_section(plans_current_values.s, -1));
        // test_next_btn(plans_current_values.sect_sel.find('.sect_right'), get_closest_section(plans_current_values.s, 1));
        test_next_btn(plans_current_values.floor_sel.find('.floor_down'), get_closest_floor(plans_current_values.f, -1));
        test_next_btn(plans_current_values.floor_sel.find('.floor_up'), get_closest_floor(plans_current_values.f, 1));
        //
        // plans_current_values.sect_sel.find('.val').text(plans_current_values.s);
        plans_current_values.floor_sel.find('.n2').text(plans_current_values.f > 9 ? plans_current_values.f : '0' + plans_current_values.f);

        update_quarter_minimap();
      }
      var not_sale_text = ['Скоро в продаже', 'В продаже', 'Забронировано', 'Продано'];
      function load_apart_details(alt) {
        var d = data.commercial.apartments[alt];
        plans_current_values.apart_details.addClass('active');
        if (d && d.st==1) {
          plans_current_values.apart_details.removeClass('not-sale')
            .find('[data-targ="n"] .val').text(d.tn).end()
            .find('[data-targ="rc"] .val').text(d.rc).end()
            .find('[data-targ="sq"] .val').html(d.sq).end()
            .find('[data-targ="tc"] .val').text(Math.round(d.tc / 10000) / 100);
        } else {
          plans_current_values.apart_details.addClass('not-sale');
          plans_current_values.apart_details.find('.not_sale_text').text(not_sale_text[d.st]);
        }
      }

      function load_apart_img(img_frame, src, time, callback) {
        preloader.show();
        img_frame.transitionStop(true).transition({'opacity':0},time,function(){
          img_frame.html('<img class="apart_img" src="'+src+'" />')
            .find('.apart_img').css({'translate3d':0}).on('load',function() {
            preloader.hide();
            img_frame.transitionStop(true).transition({'opacity':1},time);
            $(this).off('load');
            if(callback) callback();
          });
        })
      }
      function load_apart(time, no_history, callback) {
        load_apart_details(plans_current_values.n);
        load_apart_img(frame.find('.plan_frame.n1 .plan_frame_centrer_position'), '/hydra/com/apts/'+plans_current_values.n+'.png', time, callback);
        load_floor_minimap(function() {
          svg_paper_floor_minimap.forEach(function(el) {
            el.bottom.attr({'opacity' : (el.alt === plans_current_values.n) ? 0.8 : 0});
          });
        });
        frame.find('.plans_close').data('targ', param_search_url);
        if (!no_history) {
          change_url('flat');
        }
        frame.find('.fav_btn').toggleClass('active', checkFavourite(plans_current_values.n));
      }


      function get_floor_css(directions,opacity,direction) {
        var css = {};
        if(directions) {
          css = get_transition_css(direction*10*directions[0]+'%',direction*10*directions[1]+'%');
        } else
        if(direction == 0) {
          css = get_transition_css('0%','0%');
        }
        if(opacity !== null) {
          css.opacity = opacity;
        }
        return css;
      }

      function test_next_btn(btn,val) {
        if (val==null) {
          btn.removeClass('active');
        } else {
          btn.addClass('active').data('targ',val).find('span').text(val < 10 ? '0' + val : val);
        }
      }
      function get_exist_floor(floor,delta) {
        floor+=delta;
        if (data.commercial.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor]) {
          return floor;
        } else {
          return get_exist_floor(floor,delta);
        }
      }
      function get_closest_floor(floor,delta,i) {
        floor += delta;
        //console.log(floor);
        if(i == undefined) {
          i=0;
        } else {
          i++;
        }
        if (i>20) {
          return null;
        } else
        if (data.commercial.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor] && data.commercial.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor].ta!=0) {
          return floor;
        } else {
          return get_closest_floor(floor,delta,i)
        }
      }
      function get_near_floor(floor) {
        var floor_down=get_closest_floor(floor, -1);
        var floor_up=get_closest_floor(floor, 1);
        var result=null;
        if((floor_up && !floor_down) || (floor_up && floor_down && floor_up-floor<floor-floor_down)) {
          result=floor_up;
        } else
        if(floor_down) {
          result=floor_down;
        }
        return result;
      }
      function get_closest_section(section,delta,i) {
        section+=delta;
        if(i==undefined) {
          i=0;
        } else {
          i++;
        }
        if (i>20) {
          return null;
        } else
        if (data.commercial.sections[plans_current_values.b+'-'+section] && data.commercial.sections[plans_current_values.b+'-'+section].ta!=0) {
          return section;
        } else {
          return get_closest_section(section,delta,i)
        }
      }
      function load_floor_animation(options) {
        var direction_floor=0;
        var direction_section=0;
        if(options.floor!=undefined) {
          var floor_next=Number(options.floor);
          if(floor_next<plans_current_values.f) {
            direction_floor=-1
          } else {
            direction_floor=1;
          }
          plans_current_values.f=floor_next;
        }
        if(options.section!=undefined) {
          var section_next=Number(options.section);
          if(section_next>plans_current_values.s) {
            direction_section=-1
          } else {
            direction_section=1;
          }
          plans_current_values.s=section_next;
        }
        load_floor(300,null,[direction_floor,direction_section], param_search.forceSearch);
        change_url();
      }


      if(plans_info.data('stage')) {
        change_stage({'stage' : plans_info.data('stage'), 'no_history' : true});
      }

      frame
        .on('click', '.search_buttons_title', function() {
          var that = $(this);

          that
            .toggleClass('active')
            .siblings('.search_buttons_hidden').transitionToggleHeight(that.hasClass('active'), 500, function() {
            frame.find('.plans__filters').data('plugin').reinitialise({fix_position:true});
          });
        })
        .on('click', '.plans__korpus-bubble', function() {
          if($(this).hasClass('active')) {
            plans_current_values.b = Number($(this).data('targ'));
            change_stage({'stage' : 1});
          }
        })
        .on('mouseenter', '.plans__korpus-bubble', function() {
          if($(this).hasClass('active')) {
            svg_paper_bg.getByAlt($(this).data('targ'))[0].stop(true).animate(100).attr({'fill' : '#ffffff'});
          }
        })
        .on('mouseleave', '.plans__korpus-bubble', function() {
          if($(this).hasClass('active')) {
            svg_paper_bg.getByAlt($(this).data('targ'))[0].stop(true).animate(100).attr({'fill' : '#01a8b7'});
          }
        })
        .on('click', '.plans__back', function(){
          var url = $(this).data('url');
          if(url){
            pjax.loadPage(url);
          } else {
            change_stage({'delta' : -1});
          }
        })
        .on('click', '.slideshow__bullet', function() {
          if(!$(this).hasClass('active') && !$(this).hasClass('inactive')) {
            change_stage({'stage' : $(this).data('targ')});
          }
        })
        .on('click', '.floor_down.active, .floor_up.active', function() {
          load_floor_animation({
            floor:$(this).data('targ')
          });
        })
        .on('click', '.pdf_btn', function() {
          window.open('/assets/php/pdf.php?t=c&id='+plans_current_values.n, '_blank');
        })
        .on('click', '.plans__rotate-button', function(){
          korpus_reverse = !korpus_reverse;
          korpus_frame.transitionStop().transition({'opacity' : '0'}, 500, function(){
            load_korpus({
              b : plans_current_values.b,
              type : 'commercial',
              view : korpus_reverse? 'rev' : ''
            }, function(){
              korpus_frame.transitionStop().transition({'opacity' : '1'}, 500);
              change_stage_details();
            });
          });
        });
    });

    function plan_check_size() {
      frame.find('.plan_frame_centrer').each(function(){
        var fr = $(this);
        var fr2 = fr.parent();
        var apart_ratio = $(this).data('targ')||1;
        var fr2_w=fr2.width();
        var fr2_h=fr2.height();
        var plan_size = Math.min(fr2_w / apart_ratio, fr2_h);
        fr.css({'width': plan_size * apart_ratio, 'height': plan_size, 'margin-top': 0.5 * (fr2_h-plan_size), 'margin-left':0.5 * (fr2_w-plan_size * apart_ratio)});
      })
    }

    frame
      .on('click', '.plans__offers-button', function() {
        $(this).parents('.plans__offers-frame').addClass('opened');
      })
      .on('click', '.plans__offers-close', function() {
        $(this).parents('.plans__offers-frame').removeClass('opened');
      });
  }())}
  if(targ=="compare") {(function(){
    page.unset = function(){
      frame.off();
      if(compare_scroll) compare_scroll.removeEvents();
    };

    page.resize = function(){
      if(compare_scroll) compare_scroll.reinitialise();
    };

    var compare_scroll;
    var $compare_scroll = frame.find('.compare__scroll');
    var $scroll_controls = frame.find('.compare__scroll-controls');

    $compare_scroll.textScroll({
      horizontal: true,
      disable_scroll: false,
      disable_swipe: true,
      contentDrag: false,
      onScroll : function(pos){},
      onReinitialise : function(disabled){
        $scroll_controls.toggleClass('hidden', disabled);
      }
    });

    compare_scroll = $compare_scroll.data('plugin');

    frame
      .on('click', '.compare__apart-btn.remove', function(e){
        var $apart_cell =  $(this).parents('.compare__cell');
        var id = $apart_cell.attr('data-id');
        compare.remove(id);
        $apart_cell.transition({'width' : '0'}, 500, function(){
          $apart_cell.remove();
          compare_scroll.reinitialise();
        });
        e.preventDefault();
        e.stopPropagation();
      })
      .on('click', '.compare__apart-btn.favorite', function(e){
        var $btn = $(this);
        var id = $btn.parents('.compare__cell').attr('data-id');
        if($btn.hasClass('active')) {
          $btn.removeClass('active');
          removeFavourite(id);
        } else {
          $btn.addClass('active');
          addFavourite(id);
        }
        e.preventDefault();
        e.stopPropagation();
      })
      .on('click', '.compare__apart', function(){
        param_search_url = pjax.getPathname();
      })
      .on('click', '.compare__scroll-arrow', function(){
        var $btn = $(this);
        var delta = $btn.data('targ');
        var position = compare_scroll.getScrollPosition();
        compare_scroll.scrollTo(position + delta * (32.5 / ($compare_scroll.width() / font_size * (compare_scroll.getMaxScrollPosition() - 1)) * 100));
      });
  }())}
  if(targ=="construction") {(function(){
    page.unset = function(){
      frame.off();
      unloadPlugin(gallery);
    };

    page.resize = function(){};

    var $albums = frame.find('.construction__album');
    var $construction_popup = frame.find('.construction__gallery');
    var gallery;
    var images;

    var gallery_template = (
      '<div class="gallery_place div_100">' +
      '<div class="g_s_area div_100">' +
      '<div class="g_btn css_ani left"  data-dir="right"></div>' +
      '<div class="g_btn css_ani right"  data-dir="left"></div>' +
      '</div>' +
      '</div>'
    );

    function update_description(num){
      $construction_popup.find('.description').transitionStop(true).transition({'opacity': '0'}, 200, function(){
        $(this).html(gallery.images[num].title).transition({'opacity': '1'}, 200);
      });
    }

    function create_korpus_select(images){
      var korpus_list = [],
        korpus_select = '';
      $.each(images, function(index, image){
        if(!image.korpus) return;
        if($.inArray(image.korpus, korpus_list) < 0){
          var korpus = /*(image.korpus.length > 1)? image.korpus.split('').join('.') :*/ image.korpus;
          korpus_list.push(image.korpus);
          korpus_select += '<div class="page__select-option" data-targ="' + image.korpus + '"><span class="label">' + get_korp_name(korpus) + '</span></div>';
        }
      });
      if(korpus_list.length > 1){
        return $(
          '<div class="construction__korpus page__select">' +
          '<div class="page__select-active"><span class="label">Все</span></div>' +
          '<div class="page__select-dropdown">' +
          '<div class="page__select-option active" data-targ="all"><span class="label">Все</span></div>' +
          korpus_select +
          '</div>' +
          '</div>'
        );
      }
      return null;
    }

    function reinit_gallery(images, callback){
      var $gallery = $(gallery_template);
      $gallery.css({'opacity' : '0'});
      unloadPlugin(gallery);
      $construction_popup.find('.gallery_place').remove();
      $construction_popup.prepend($gallery);
      gallery = $gallery.galleryInit({
        images: images,
        start_num: 0,
        previews: false,
        dots: false,
        previews_num: 0,
        vertical: false,
        zoom: 0,
        loadComplete: function(){
          if(callback) callback($gallery);
          update_description(0);
        },
        afterMove: function(num){
          update_description(num);
        },
        bg_style: 'cover'
      });
      gallery.images = images;
    }

    function open_construction_popup(el, delay) {
      if(!el.length) return;
      var id = el.data('id');
      var url = el.data('url');
      delay = delay || 0;
      el.addClass('active').siblings().removeClass('active');
      if($construction_popup.hasClass('visible')){
        $construction_popup.removeClass('visible');
        delay = 1000;
      }
      var jqXHR = $.ajax({
        url: '/ajax/construction_load',
        dataType: 'json',
        data: {id: id},
        success: function(response){
          delay = Math.max(delay - (new Date() * 1 - jqXHR.timestamp), 0);
          setTimeout(function(){
            images = response.images;
            var $korpus_select = create_korpus_select(images);
            $construction_popup.find('.construction__korpus').remove();
            if($korpus_select) $construction_popup.prepend($korpus_select);
            reinit_gallery(images, function($gallery){
              $gallery.css({'opacity' : '1'});
              $construction_popup.addClass('visible');
            });
            $construction_popup.find('.date').html(response.date);
          }, delay);
          //pjax.loadPage(url, {'suppress_load': true});
        }
      });
      jqXHR.timestamp = new Date() * 1;
    }

    (function(){
      if(pages_info.previous && pages_info.previous.type !== 'construction') {
        frame.find('.construction__column')
          .css({'x': '150%', 'opacity': '0'})
          .transition({'x': '0%','opacity': '1'}, 1000, function () {
            open_construction_popup($albums.eq(0));
          });
        frame.find('.construction__title')
          .css({'opacity': 0, 'x': '30%'})
          .delay(800).transition({'opacity': 1, 'x': 0}, 1000);
      } else {
        open_construction_popup($albums.eq(0));
      }
    })();

    frame.on('click', '.construction__album', function(){
      var $album = $(this);
      if($album.hasClass('active')) return;
      open_construction_popup($album);
    });

    frame
      .on('click', '.construction__korpus .page__select-option', function(){
        var filtered,
          $item = $(this),
          $select = $item.parents('.page__select'),
          korpus = $(this).attr('data-targ');
        if($item.hasClass('active')) return;
        $item.addClass('active').siblings().removeClass('active');
        if(korpus === "all") filtered = images;
        else filtered = images.filter(function(image, index){
          return (image.korpus === korpus);
        });
        $select.find('.page__select-active .label').text($item.text());
        $construction_popup.find('.gallery_place').transitionStop(true).transition({'opacity' : '0'}, 750, function(){
          reinit_gallery(filtered, function($gallery){
            $gallery.transition({'opacity' : '1'}, 750);
          });
        });
      })
      .on('click', '.webcam_open', function(){
        var body_size = $body = $('body');
        var centrer2 = $('#centrer2');
        var scroll2 = centrer2.find('.scroll_frame');

        var popup = body_size.find('.scroll_frame').openPopup({
          template: 'webcam',
          class_name: 'webcam__popup',
          targ: $(this).data('targ'),
          name: $(this).data('name'),
          beforeOpen: function(popup){
            function close(time, callback){
              popup.transitionHide(500, function(){
                if(callback) callback();
                popup.remove();
              });
            }
            popup.find('.close_btn').off().on('click', close);
            popup.data('api', {'close' : close});
            body_size.removeClass('menu-opened');
          },
          afterClose: function(popup){},
          loadAnimate: function(popup){
            popup.transitionShow(500);
          },
          unloadAnimate : function(popup, callback){}
        });
        menu_frame.removeClass('hover');
      });;
  }())}
  if(targ=="contacts") {(function(){
    page.unset=function(){
      frame.off();
      map.destroy();
      unloadPlugin(route);
    };

    var route, map;

    ymaps.ready(function() {
      var obj_point = [55.682295, 37.250234];

      var map_id = 'map_' + (new Date * 1);
      frame.find('.map_place').attr('id', map_id);

      map = new ymaps.Map(
        map_id, {
          center: obj_point,
          zoom: 16,
          type: 'yandex#map',
          behaviors: ['default', 'scrollZoom']
        }, {
          searchControlProvider: 'yandex#search',
          suppressMapOpenBlock: true
        }
      );

      map.geoObjects.add(new ymaps.Placemark(obj_point, {
          hintContent: ''
        }, {
          iconLayout: 'default#image',
          iconImageClipRect: [[907, 2], [960, 75]],
          iconImageHref: '/assets/i/sprite.png',
          iconImageSize: [53, 73],
          iconImageOffset: [-26, -73]
        }
      ));

      route = frame.mapsRoute({
        map: map,
        destination: obj_point,
        input_frame: frame.find('.placement__route-frame'),
        originImage: {
          iconImageClipRect: [[965, 2], [982, 36]],
          iconImageHref: '/assets/i/sprite.png',
          iconImageSize: [17, 34],
          iconImageOffset: [-8, -34],
          cursor: 'default'
        },
        polylineOptions: {
          strokeColor: '#01a8b7',
          strokeOpacity: 1,
          strokeWeight: 6
        },
        type: 'yandex'
      });

      frame
        .on('click', '.placement__route-close', function() {
          route.setOff();
          map.setCenter(obj_point, 15);
          $(this).parents('.placement__route-frame').addClass('folded');
        })
        .on('click', '.placement__route-frame.folded', function() {
          route.setOn();
          map.setCenter(obj_point, 12);
          $(this).removeClass('folded');
        });
    });

    frame.find('.about__images-item').wrap('<div class="contacts__image"></div>');

    frame
      .on('click', '.about__text-close', function() {
        $(this).parents('.about__text-frame').addClass('folded');
      })
      .on('click', '.about__text-frame.folded', function() {
        $(this).removeClass('folded');
      })
      .on('click', '.contacts__image', function() {
        var images = $(this).parent().data('images').split(',');
        var start_num = $.inArray($(this).find('.about__images-item').data('targ'), images);

        images = images.map(function(item){
          return {src: item};
        });

        open_popup_gallery({
          bg_style: 'cover',
          images: images,
          start_num: start_num,
          frame: frame2
        });
      });

  }())}
  if(targ=="design") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(slideshow);
      unloadPlugin(scroll_controller);

      if(bg_video.intro_playing){
        bg_video.intro_playing = false;
        bg_video.stop();
        bg_video.hide();
        animate_layout();
      }
    };

    page.resize=function(){
      $home_content.css({'height' : frame_h, 'width' : frame_w});
      element_scale_inside(frame.find('.home__slideshow-image'), 1.78, false, {'y' : 'bottom'});
      screen2_h = screen2.height();
      move_screen_2(cur_pos);
    };


    var $home_content = frame.find('.home__content');
    var slideshow, scroll_controller,
      screen2 = frame.find('.home__screen.n2'),
      screen2_h,
      cur_pos = 0;

    function init_content() {

      /* SLIDESHOW */
      function gallery_start(num){
        if(num == 1){
          var images = gallery_images_1.map(function (item) {
              return item[0];
            }),
            interval = 7000;
        } else {
          var images = gallery_images_2.map(function (item) {
              return item[0];
            }),
            interval = 7000;
        }


        function slideshow_progress(delay) {
          frame2
            .find('.slideshow__controls-frame')
            .prepend('<div class="slideshow__progress"></div>')
            .find('.slideshow__progress').first().css({'transition-duration' : (interval + 1000) + 'ms'}).delay(delay).queue(function(next) {
            $(this).addClass('animating');
            next();
          })
            .nextAll('.slideshow__progress').remove();
        }

        slideshow = frame2.find('.design_gallery .home__slideshow-image').slideshowInit({
          slides: images,
          path: '',
          prefix: '',
          interval: interval,
          time: 1000,
          beforeChange: function (img, cur_number, old_number, direction) {
            //img.css({'top': '100%', 'translate3d': 0});
            direction = (direction > 0)? 1 : -1;
            img.css({'x' : direction * 100 + '%'}).transition({'x' : '0%'}, 1000);
            frame2.find('.slideshow__bullet[data-targ="' + cur_number + '"]').setActive();
            var $slogan = $('<div class="home__slogan"><div class="home__slogan-text">'+( (num==1) ? gallery_images_1[cur_number][1] : gallery_images_2[cur_number][1] )+'</div></div>');
            $slogan
              .appendTo(frame.find('.home__slogans-frame'))
              .css({'opacity' : 0, 'x' : ((direction > 0)? 1 : -1) * 80 + '%'}).delay(750)
              .transition({'opacity' : 1, 'x' : 0}, 500)
              .prevAll('.home__slogan').transitionStop(true).transition({'opacity' : 0}, 500, function () {
              $(this).remove();
            });

            slideshow_progress(1000);
          },
          finishCSS: {'line-height' : '0'}
        });

      }


      /* end SLIDESHOW */

      /* SCROLL CONTROLLER */

      var keyframes = [0, 1, 2];

      var css_moving_elements = new init_css_moving_elements({
        elements: frame.find('.scroll_elements'),
        // keyframes: keyframes,
        elements_positions: {
          'home__screen-1':[
            {
              pos: 0,
              css: {
                top: '0%'
              }
            },{
              pos: 1,
              css: {
                top: '-100%'
              }
            }
          ],
          'home__col-2':[
            {
              pos: 0,
              css: {
                y: '0em'
              }
            },{
              pos: 1,
              css: {
                y: '-40em'
              }
            }
          ],
          'home__col-3':[
            {
              pos: 0,
              css: {
                y: '120%'
              }
            },{
              pos: 0.4,
              css: {
                y: '120%'
              }
            },{
              pos: 1,
              css: {
                y: '0%'
              }
            },{
              pos: 2,
              css: {
                y: '-80%'
              }
            }
          ],
          'home__col-4':[
            {
              pos: 1,
              css: {
                y: '60%'
              }
            },{
              pos: 1.4,
              css: {
                y: '-50%'
              }
            }
          ],
          'home__text' : [
            {
              pos: 0,
              css: {
                x: '-6em',
                opacity : 0
              }
            },
            {
              pos: 0.3,
              css: {
                x: '0',
                opacity : 1
              }
            }
          ],
          'home__tile-content-1' : [
            {
              pos: 0,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.4,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.6,
              css: {
                y: '0em',
                opacity : 1
              }
            }
          ],
          'home__tile-content-3' : [
            {
              pos: 0,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.1,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.4,
              css: {
                y: '0em',
                opacity : 1
              }
            }
          ],
          'home__tile-5' : [
            {
              pos: 0.68,
              css: {
                top: '-8em'
              }
            },
            {
              pos: 1,
              css: {
                top: '47em'
              }
            },
            {
              pos: 1.4,
              css: {
                top: '10em'
              }
            }
          ],
          'home__tile-6' : [
            {
              pos: 0,
              css: {
                y: '-12em'
              }
            },
            {
              pos: 0.4,
              css: {
                y: '-12em'
              }
            },
            {
              pos: 1,
              css: {
                y: '-11em'
              }
            },
            {
              pos: 1.4,
              css: {
                y: '-100em'
              }
            }
          ],
          'home__tile-8' : [
            {
              pos: 1,
              css: {
                top: '-10%'
              }
            },
            {
              pos: 1.25,
              css: {
                top: '0%'
              }
            },
            {
              pos: 1.345,
              css: {
                top: '0%'
              }
            }
          ],
          'home__tile-7' : [
            {
              pos: 1,
              css: {
                top: '30%'
              }
            },
            {
              pos: 1.345,
              css: {
                top: '0%'
              }
            }
          ],
          'about__scroll-help':[
            {
              pos: 0,
              css: {
                y : '0em',
                opacity: 1
              }
            },
            {
              pos: 0.4,
              css: {
                y : '-45em',
                opacity: 0
              }
            }
          ],
          'vr_tour':[
            {
              pos: 0,
              css: {
                y : '0em',
                opacity: 1
              }
            },
            {
              pos: 0.4,
              css: {
                y : '-16em',
                opacity: 0
              }
            }
          ]
        }
      });

      scroll_controller = new init_scroll_controller({
        magnet: false,
        magnet_delta: 0.1,
        scroll_speed: 0.035,
        start_position: keyframes[0],
        events_area: frame,
        max_position: 1.4,
        animation_callback_before: function(pos) {

        },
        animation_callback_after: function(pos) {

        },
        animation_time: 1000,
        onMove: function(pos) {
          cur_pos = pos;
          css_moving_elements.move(pos);
          move_screen_2(pos);
          menu_btn.toggleClass('blue', pos < 0.2);
        }
      });


      frame
        .on('click', '.scroll-top__button', function() {
          scroll_controller.move({'target' : 0, 'time' : 800});
        })
        .on('click', '.home__scroll-help', function() {
          scroll_controller.move({'target' : 0.5, 'time' : 800});
        });

      /* end SCROLL CONTROLLER */

      // if(!offer_shown) {
      //     setTimeout(function() {
      //         frame.find('.home__offer-frame').transitionShow(1000, function() {
      //             offer_shown = true;
      //         });
      //     }, 3000);
      // }

      frame
        .on('click', '.home__news-menu-item', function() {
          var that = $(this),
            dt = $(this).data('targ');

          that.setActive();
          frame.find('.home__news-center[data-targ="' + dt + '"]').setActive();
        })
        .on('click', '.home__offer-frame', function(e) {
          if(e.target.className === 'home__offer-frame' || e.target.className === 'home__offer-item div_100 active') $(this).transitionHide(500);
        })
        .on('click', '.home__offer-close', function() {
          $(this).parents('.home__offer-frame').transitionHide(500);
        })
        .on('click', '.home__offer-bullet', function() {
          $(this).setActive();
          frame.find('.home__offer-item').eq($(this).data('targ')).setActive();
        })
        .on('click', '.home__tile.n7', function() {
          frame.find('.design_gallery[data-targ=1]').addClass('active');
          gallery_start(1);
          slideshow.loadImg(7);
        })
        .on('click', '.home__tile.n8', function() {
          frame.find('.design_gallery[data-targ=2]').addClass('active');
          gallery_start(2);
          slideshow.loadImg(7);
        })
        .on('click', '.design_gal_close', function() {
          frame.find('.design_gallery').removeClass('active');
          slideshow.setOff();
        })
        .on('click', '.design_gallery.active .slideshow__bullet', function() {
          slideshow.loadImgNumber($(this).data('targ'));
        })
        .on('click', '.design_gallery.active .slideshow__arrow', function() {
          console.log($(this).data('targ'));
          slideshow.loadImg($(this).data('targ'));
        })
        .on('click', '.about__scroll-help', function() {
          scroll_controller.move({'target' : 0.679, 'time' : 800});
        })



      /* Criteo */
      // window.criteo_q.push({event : "viewHome"});
    }


    function move_screen_2(pos) {
      var next_pos = frame_h - (screen2_h + frame_h / 3) * pos,
        next_css = {};

      next_css[transitions_av ? 'y' : 'top'] = next_pos;
      screen2.css(next_css);
    }

    function animate_layout(delay){
      delay = delay || 0;
      $('.logo, .header').each(function(index){
        $(this).delay(delay + index * 250).transition({'x' : '0'}, 750, function(){ $(this).removeAttr('style')});
      });
      $menu.css({'display' : 'block'}).find('.menu__item ').each(function(index){
        $(this).delay(delay + 750 + index * 100).transition({'y' : '0'}, 600, function(){$(this).removeAttr('style')});
      });
      $('.header__contacts').delay(delay + 1250).transition({'x' : 0}, 750, function(){$(this).removeAttr('style')});
      $('.favourites__button').delay(delay + 1500).transition({'x' : 0}, 750, function(){$(this).removeAttr('style')});
      $('.share__container').delay(delay + 1750).transition({'margin-right' : 0}, 750, function(){$(this).removeAttr('style')});
      $('.footer').delay(delay + 1750).transition({'y' : 0}, 750, function(){$(this).removeAttr('style')});
    }
    /*setTimeout(function(){
    console.log(cur_pos);
    if(cur_pos < 0.2){
        setTimeout(function(){
           scroll_controller.move({'target' : 0.679, 'time' : 800});
       }, 2500);
    }
}, 2000);*/

    var $loader = frame.find('.home__loader');
    var $overflow = frame.find('.home__overflow');

    if(!pages_info.previous.type && 0) {
      (function(){
        frame.css({'display' : 'none'});
        $loader.css({'display' : 'block'});
        $overflow.css({'width' : '0'});
        $('.logo, .header').transition({'x' : '-30em'}, 1);
        $menu.css({'display' : 'none'}).find('.menu__item ').css({'y' : '-10em'});
        $('.header__contacts').css({'x' : '40em'});
        $('.favourites__button').css({'x' : '10em'});
        $('.share__container').css({'margin-right' : '-10em'});
        $('.footer').css({'y' : '30em'});

        function video_ended(){
          load_page_js(pages_info.current.type, pages_info.previous.type);
        }

        if(bg_video) {
          $('.bg_video').hide();
          bg_video.load_bg_video('intro', frame.find('.video-bg'), $.Deferred());
          bg_video.intro_playing = true;

          $loader.find('.home__loader-skip')
            .css({'display' : 'block', 'y' : '-100%', 'opacity' : '0'}).delay(1000)
            .transition({'y' : '0em', 'opacity' : '1'}, 700, function(){
              $('.logo, .header').each(function(index){
                $(this).delay(index * 250).transition({'x' : '0'}, 750, function(){ $(this).removeAttr('style')});
              });
              $(this).addClass('loading').delay(1500).queue(function(next){
                next();
                $('.bg_video').show();
                bg_video.play();
              }).on('click', video_ended);
            });

        } else {
          setTimeout(function(){
            video_ended();
          }, 250);
        }
      })();
    } else if(pages_info.previous.type === 'home'){
      (function(){
        if(bg_video) {
          $loader.find('.home__loader-skip').transitionStop(true).transition({'y' : '-100%', 'opacity' : '0'});
          bg_video.intro_playing = false;
          bg_video.stop();
          bg_video.hide();
        }
        animate_layout(0);
        frame.css({'display' : 'block'});
        $overflow.delay(500).transition({'width' : '100%'}, 1750, function(){
          $loader.remove(0);
          init_content();
        });
      })();
    } else {
      init_content();
    }
  }())}
  if(targ=="documents") {(function(){
    page.unset=function(current, next){
      frame.off();
      unloadPlugin(docs_search);
      if(ani_names[current+':'+next]) {
        frame.find('.text_bg').transition({'scale':0.5,'opacity':0},1300);
      }
    }


    if(bg_video) {
      bg_video.load_page_video(frame,pages_info.current.url);
    }
    /*frame2.find('.text_bg').moveEl({
	type:'from',
	opacity:0,
	'margin-left':250,
	left:'-25%',
	time:1000,
	delay:time,
	easing:easyInOut,
	callback:function(el){

	}
});*/
    var text_scroll=frame.find('.text_scroll').data('plugin');

    var docs_search=frame.find('.docs_search_input').docsSearch({
      searchCallback: function(){
        text_scroll.reinitialise();
      }
    });

    frame
      .on('click','.docs_item_details_btn',function(){
        $(this).next().toggleClass('active');
        text_scroll.reinitialise({fix_position:true});
      })
  }())}
  if(targ=="favorites") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(param_search);
    };

    /*if(search_page_prev) {
    frame2.append('<a class="plans_close pjax" href="'+search_page_prev+'"></a>');
}*/

    var param_search;
    var finishing =['Без отделки', 'С отделкой'];
    test_json('living', function() {
      var filtered_data = {};
      for(var i = 0, l = favourites.length; i < l; i ++) {
        filtered_data[favourites[i]] = data.living.apartments[favourites[i]];
      }
      param_search = frame2.searchInit({
        data: filtered_data,
        resultClick: function (id, e) {
          if(e.target.className == 'fav-del-btn') {
            removeFavourite(id);
            delete filtered_data[id];
            param_search.updateData(filtered_data);
            frame.find('.search_preview_frame').hide();
          } else {
            param_search_url = pjax.getPathname();
            var d = data.living.apartments[id];
            pjax.loadPage('/plans/korpus' + d.b + '/section' + d.s + '/floor' + d.f + '/flat' + d.n);
          }
        },
        rules: {
          'fav_del' : function(val) {
            return '<span class="fav-del-btn"></span>';
          },
          'img': function(val,id) {
            return '<img class="fav-preview" src="/hydra/apts/' + id + '.png">';
          }
        },
        notfound_text: 'Пока у вас нет избранных квартир<br><a href="/plans" class="pjax">Перейти к выбору квартиры</a>',
        htmlNoLoad: true
      });
    });
  }())}
  if(targ=="gallery") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(gallery);
    };

    var gallery_frame = frame.find('.gallery_place');
    var gallery = gallery_frame.galleryInit({
      images: gallery_images,
      start_num: start_num,
      previews: true,
      dots: false,
      previews_num: 1,
      vertical: false,
      zoom: 2,
      loadComplete: function() {
        frame1.find('.wait-load').remove();
      }
    });
  }())}
  if(targ=="gmaps") {(function(){

  }())}
  if(targ=="home") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(slideshow);
      unloadPlugin(scroll_controller);

      if(bg_video.intro_playing){
        bg_video.intro_playing = false;
        bg_video.stop();
        bg_video.hide();
        animate_layout();
      }
    };

    page.resize=function(){
      $home_content.css({'height' : frame_h, 'width' : frame_w});
      element_scale_inside(frame.find('.home__slideshow-image'), 1.78, false, {'y' : 'bottom'});
      screen2_h = screen2.height();
      move_screen_2(cur_pos);
    };


    var $home_content = frame.find('.home__content');

    var slideshow, scroll_controller,
      screen2 = frame.find('.home__screen.n2'),
      screen2_h,
      cur_pos = 0;

    function init_content() {

      /* SLIDESHOW */

      var images = gallery_images.map(function (item) {
          return item[0];
        }),
        interval = 7000;

      function slideshow_progress(delay) {
        frame2
          .find('.slideshow__controls-frame')
          .prepend('<div class="slideshow__progress"></div>')
          .find('.slideshow__progress').first().css({'transition-duration' : (interval + 1000) + 'ms'}).delay(delay).queue(function(next) {
          $(this).addClass('animating');
          next();
        })
          .nextAll('.slideshow__progress').remove();
      }

      slideshow = frame2.find('.home__slideshow-image').slideshowInit({
        slides: images,
        path: '',
        prefix: '',
        interval: interval,
        time: 1000,
        beforeChange: function (img, cur_number, old_number, direction) {
          //img.css({'top': '100%', 'translate3d': 0});
          direction = (direction > 0)? 1 : -1;
          img.css({'x' : direction * 100 + '%'}).transition({'x' : '0%'}, 1000);
          frame2.find('.slideshow__bullet[data-targ="' + cur_number + '"]').setActive();
          var $slogan = $('<div class="home__slogan"><div class="home__slogan-text">'+gallery_images[cur_number][1]+'</div></div>');
          $slogan
            .appendTo(frame.find('.home__slogans-frame'))
            .css({'opacity' : 0, 'x' : ((direction > 0)? 1 : -1) * 80 + '%'}).delay(750)
            .transition({'opacity' : 1, 'x' : 0}, 500)
            .prevAll('.home__slogan').transitionStop(true).transition({'opacity' : 0}, 500, function () {
            $(this).remove();
          });

          slideshow_progress(1000);
        },
        finishCSS: {'line-height' : '0'}
      });

      slideshow_progress(10);

      frame
        .on('click', '.slideshow__bullet', function() {
          slideshow.loadImgNumber($(this).data('targ'));
        })
        .on('click', '.slideshow__arrow', function() {
          slideshow.loadImg($(this).data('targ'));
        });

      /* end SLIDESHOW */

      /* SCROLL CONTROLLER */

      var keyframes = [0, 1];

      var css_moving_elements = new init_css_moving_elements({
        elements: frame.find('.scroll_elements'),
        // keyframes: keyframes,
        elements_positions: {
          'home__screen-1':[
            {
              pos: 0,
              css: {
                top: '0%'
              }
            },{
              pos: 1,
              css: {
                top: '-100%'
              }
            }
          ],
          'home__col-2':[
            {
              pos: 0,
              css: {
                y: '0em'
              }
            },{
              pos: 1,
              css: {
                y: '-50em'
              }
            }
          ],
          'home__col-3':[
            {
              pos: 0,
              css: {
                y: '0em'
              }
            },{
              pos: 1,
              css: {
                y: '-20em'
              }
            }
          ],
          'home__text' : [
            {
              pos: 0,
              css: {
                x: '-6em',
                opacity : 0
              }
            },
            {
              pos: 0.3,
              css: {
                x: '0',
                opacity : 1
              }
            }
          ],
          'home__tile-content-1' : [
            {
              pos: 0,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.4,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.6,
              css: {
                y: '0em',
                opacity : 1
              }
            }
          ],
          'home__tile-content-3' : [
            {
              pos: 0,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.1,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.4,
              css: {
                y: '0em',
                opacity : 1
              }
            }
          ],
          'home__tile-content-5' : [
            {
              pos: 0,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.2,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.4,
              css: {
                y: '0em',
                opacity : 1
              }
            }
          ],
          'home__tile-content-6' : [
            {
              pos: 0,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.4,
              css: {
                y: '-12em',
                opacity : 0
              }
            },
            {
              pos: 0.7,
              css: {
                y: '0em',
                opacity : 1
              }
            }
          ],
          'home__news-menu':[
            {
              pos: 0,
              css: {
                opacity: 0,
                y : '50%'
              }
            },
            {
              pos: 0.5,
              css: {
                opacity: 0,
                y : '50%'
              }
            },
            {
              pos: 0.8,
              css: {
                opacity: 1,
                y : '0%'
              }
            }
          ],
          'about__scroll-help':[
            {
              pos: 0,
              css: {
                y : '0em',
                opacity: 1
              }
            },
            {
              pos: 0.4,
              css: {
                y : '-45em',
                opacity: 0
              }
            }
          ]
        }
      });

      scroll_controller = new init_scroll_controller({
        magnet: false,
        magnet_delta: 0.1,
        scroll_speed: 0.035,
        start_position: keyframes[0],
        events_area: frame2,
        max_position: 1,
        animation_callback_before: function(pos) {

        },
        animation_callback_after: function(pos) {

        },
        animation_time: 1000,
        onMove: function(pos) {
          cur_pos = pos;
          css_moving_elements.move(pos);
          move_screen_2(pos);
          menu_btn.toggleClass('blue', pos < 0.2);
          if(pos > 0.1){
            $('.cookie_popup_frame').fadeOut(500, function(){
              $('.cookie_popup_frame').remove();
            })
          }
        }
      });


      frame
        .on('click', '.scroll-top__button', function() {
          scroll_controller.move({'target' : 0, 'time' : 800});
        })
        .on('click', '.home__scroll-help', function() {
          scroll_controller.move({'target' : 0.5, 'time' : 800});
        });

      /* end SCROLL CONTROLLER */

      // if(!offer_shown) {
      //     setTimeout(function() {
      //         frame.find('.home__offer-frame').transitionShow(1000, function() {
      //             offer_shown = true;
      //         });
      //     }, 3000);
      // }

      frame
        .on('click', '.home__news-menu-item', function() {
          var that = $(this),
            dt = $(this).data('targ');

          that.setActive();
          frame.find('.home__news-center[data-targ="' + dt + '"]').setActive();
        })
        .on('click', '.home__offer-frame', function(e) {
          if(e.target.className === 'home__offer-frame' || e.target.className === 'home__offer-item div_100 active') $(this).transitionHide(500);
        })
        .on('click', '.home__offer-close', function() {
          $(this).parents('.home__offer-frame').transitionHide(500);
        })
        .on('click', '.home__offer-bullet', function() {
          $(this).setActive();
          frame.find('.home__offer-item').eq($(this).data('targ')).setActive();
        });



      /* Criteo */
      // window.criteo_q.push({event : "viewHome"});
    }


    function move_screen_2(pos) {
      var next_pos = frame_h - (screen2_h + frame_h / 3) * pos,
        next_css = {};

      next_css[transitions_av ? 'y' : 'top'] = next_pos;
      screen2.css(next_css);
    }

    function animate_layout(delay){
      delay = delay || 0;
      $('.logo, .header').each(function(index){
        $(this).delay(delay + index * 250).transition({'x' : '0'}, 750, function(){ $(this).removeAttr('style')});
      });
      $menu.css({'display' : 'block'}).find('.menu__item ').each(function(index){
        $(this).delay(delay + 750 + index * 100).transition({'y' : '0'}, 600, function(){$(this).removeAttr('style')});
      });
      $('.header__contacts').delay(delay + 1250).transition({'x' : 0}, 750, function(){$(this).removeAttr('style')});
      $('.favourites__button').delay(delay + 1500).transition({'x' : 0}, 750, function(){$(this).removeAttr('style')});
      $('.share__container').delay(delay + 1750).transition({'margin-right' : 0}, 750, function(){$(this).removeAttr('style')});
      $('.footer').delay(delay + 1750).transition({'y' : 0}, 750, function(){$(this).removeAttr('style')});
    }

    var $loader = frame.find('.home__loader');
    var $overflow = frame.find('.home__overflow');

    if(!pages_info.previous.type) {
      (function(){
        frame.css({'display' : 'none'});
        $loader.css({'display' : 'block'});
        $overflow.css({'width' : '0'});
        $('.logo, .header').transition({'x' : '-30em'}, 1);
        $menu.css({'display' : 'none'}).find('.menu__item ').css({'y' : '-10em'});
        $('.header__contacts').css({'x' : '40em'});
        $('.favourites__button').css({'x' : '10em'});
        $('.share__container').css({'margin-right' : '-10em'});
        $('.footer').css({'y' : '30em'});

        function video_ended(){
          load_page_js(pages_info.current.type, pages_info.previous.type);
        }

        if(false && bg_video) {
          $('.bg_video').hide();
          bg_video.load_bg_video('intro', frame.find('.video-bg'), $.Deferred());
          bg_video.intro_playing = true;

          $loader.find('.home__loader-skip')
            .css({'display' : 'block', 'y' : '-100%', 'opacity' : '0'}).delay(1000)
            .transition({'y' : '0em', 'opacity' : '1'}, 700, function(){
              $('.logo, .header').each(function(index){
                $(this).delay(index * 250).transition({'x' : '0'}, 750, function(){ $(this).removeAttr('style')});
              });
              $(this).addClass('loading').delay(1500).queue(function(next){
                next();
                $('.bg_video').show();
                bg_video.play();
              }).on('click', video_ended);
            });

        } else {
          setTimeout(function(){
            video_ended();
          }, 250);
        }
      })();
    } else if(pages_info.previous.type === 'home'){
      (function(){
        if(bg_video) {
          $loader.find('.home__loader-skip').transitionStop(true).transition({'y' : '-100%', 'opacity' : '0'});
          bg_video.intro_playing = false;
          bg_video.stop();
          bg_video.hide();
        }
        animate_layout(0);
        frame.css({'display' : 'block'});
        $overflow.delay(500).transition({'width' : '100%'}, 1750, function(){
          $loader.remove(0);
          init_content();
        });
      })();
    } else {
      init_content();
    }
  }())}
  if(targ=="infrastructure") {(function(){
    page.unset=function(){
      frame.off();
      map.destroy();
    };

    function get_icon_rect(type) {
      return [[2 + 45 * type, 92], [42 + 45 * type, 132]];
    }

    var map;

    test_json('infrastructure', function(){
      ymaps.ready(function() {
        var filter_state = 'all';
        var obj_point = [55.682049, 37.245918];

        var map_id = 'map_' + (new Date * 1);
        frame.find('.map_place').attr('id', map_id);

        map = new ymaps.Map(
          map_id, {
            center: obj_point,
            zoom: 16,
            type: 'yandex#map',
            behaviors: ['default', 'scrollZoom']
          }, {
            searchControlProvider: 'yandex#search',
            suppressMapOpenBlock: true
          }
        );

        map.geoObjects.add(new ymaps.Placemark(obj_point, {
            hintContent: ''
          }, {
            iconLayout: 'default#image',
            iconImageClipRect: [[907, 2], [960, 75]],
            iconImageHref: '/assets/i/sprite.png',
            iconImageSize: [53, 73],
            iconImageOffset: [-26, -73]
          }
        ));

        var clusterer = new ymaps.Clusterer({
          //            clusterIcons : clusterIcons,
          gridSize: 100,
          preset: 'twirl#lightblueClusterIcons'
        });

        var markers = [];

        $.each(data.infrastructure, function(i, group){
          $.each(group.points, function(i2, point){
            var type = group.id;
            var placemark = new ymaps.Placemark(
              point.position, {
                //                        balloonContentBody: point[2],
                clusterCaption: point.title,
                hintContent: point.title,
              }, {
                iconLayout: 'default#image',
                iconImageClipRect: get_icon_rect(type),
                iconImageHref: '/assets/i/infra_sprite.png',
                iconImageSize: [40, 40],
                iconImageOffset: [-20, -40],

                //                        cursor: 'pointer',
                //                        balloonCloseButton: true,
                //                        hideIconOnBalloonOpen: true
              }
            );
            if(type == 13){
              placemark.events.add('click', function (i){
                window.open('https://hadassah.moscow/');
              });
            }
            placemark.type = type;
            markers.push(placemark);
          });
        });

        clusterer.add(markers);

        //        clusterer.events.once('objectsaddtomap', function () {
        //            map.setBounds(clusterer.getBounds());
        //        });

        map.geoObjects.add(clusterer);


        function toggle_markers(show) {
          var $groups = frame.find('.infrastructure__group.active');
          var active_l = $groups.length;
          for(var i = 0, length = markers.length; i < length; i ++) {
            var type = markers[i].type;
            var visible = (active_l && $groups.filter('.n' + type).hasClass('active') && show) || (!active_l && show);
            markers[i].options.set('visible', visible);
          }
        }

        toggle_markers(true);

        frame.on('click', '.infrastructure__group', function(){
          var $button = $(this);
          if(!$button.hasClass('active')) {
            $button.siblings().removeClass('active');
          }
          $button.toggleClass('active');
          toggle_markers(true);
        });
      });
    });
  }())}
  if(targ=="korpus") {(function(){
    page.unset=function(){
      frame.off();
      plans_current_values.n=null;
      unloadPlugin(apart_zoom);
      unloadPlugin(mortgage_calculator);
    };
    page.resize=function(){
      plan_check_size();
      if (apart_zoom) {
        apart_zoom.reinitialise();
      }
    };
    page.cursorMove=function(){
      if (apart_zoom) {
        apart_zoom.move(mouse_pos);
      }
    };

    var svg_paper_bg, apart_zoom, mortgage_calculator;

    plans_current_values.b = Number(frame.find('.plans_info').data('korpus'));
    plans_current_values.sect_sel = frame.find('.korp_det.n1');
    plans_current_values.floor_sel = frame.find('.korp_det.n2');
    plans_current_values.apart_details = frame.find('.apart_details_frame');
    frame.find('.korp_det.n0 .korp_det_val>div').text(plans_current_values.b);

    if(!mobile) {
      apart_zoom = frame.find('.plan_frame.n1 .plan_frame_centrer_position').apartZoom({
        margin: 0.1,
        scale: 2,
        type: 'lens',
        bg_color: '#aaaaaa'
      });
    }

    test_json('living', function() {
      if (frame.hasClass('opened_floor') || frame.hasClass('opened_apart')) {
        frame.find('.floor_frame, .blur_bg').transitionShow(0);
        plans_current_values.s = Number(frame.find('.plans_info').data('section'));
        plans_current_values.f = Number(frame.find('.plans_info').data('floor'));
        if (frame.hasClass('opened_floor')) {
          load_floor(0, true);
        } else
        if (frame.hasClass('opened_apart')) {
          plans_current_values.n = plans_current_values.b+'-'+frame.find('.plans_info').data('flat');
          load_floor_details();
          load_apart_details(plans_current_values.n);
          load_apart(plans_current_values.n, 0, true);
        }
      }
      param_search_url=null;

      var floor_popup = frame.find('.floor_popup');
      var svg_paper_bg_frame=frame.find('.plans_map_cont');
      svg_paper_bg = svg_paper_bg_frame.area2svg({
        /*'masked-img': frame.find('.wait-load').attr('src').replace('.jpg','_.jpg'),
		'masked-show-all': false,*/
        'fill': '#ffffff',
        'fill-opacity': 0.5,
        'width': 1600,
        'height': 900,
        click: function (el) {
          if (el.at) {
            plans_current_values.s = Number(el.alt.split('-')[0]);
            plans_current_values.f = Number(el.alt.split('-')[1]);
            floor_frame_show();
            floor_popup.removeClass('active');
          }
        },
        mouseover: function (el) {
          el.bottom.stop().animate(200).attr({'fill-opacity':0.9});
          if (el.at) {
            var box = el.bbox();
            var scale = svg_paper_bg_frame.width() / svg_paper_bg.width;
            floor_popup.addClass('active').css(get_transition_css(box.cy*scale, box.cx * scale))
              .find('.n1>div').text(el.alt.split('-')[0]).end()
              .find('.n2>div').text(el.alt.split('-')[1]).end()
              .find('.n3').html('<div>'+el.at+'</div>квартир'+word_end(el.at));
          }
        },
        mouseout: function (el) {
          el.bottom.stop().animate(200).attr({'fill-opacity':0.5});
          if (el.at) {
            floor_popup.removeClass('active');
          }
        }
      });
      test_floors(data.living.floors);
    })


    function floor_frame_show() {
      frame.find('.floor_frame').transitionShow(700);
      frame.find('.blur_bg').transitionShow(400);
      load_floor(0);
      plan_check_size();
    }
    function floor_frame_hide() {
      frame.find('.floor_frame').transitionHide(400);
      frame.find('.blur_bg').transitionHide(700);
      change_url('korpus');
      plans_current_values.n=null;
      frame.removeClass('opened_floor opened_apart').addClass('closed_floor');
    }
    function load_floor(time, no_history, directions) {
      plans_current_values.n=null;
      if (apart_zoom) {
        apart_zoom.setOff();
      }
      frame.find('.plans_close').data('targ', null);
      load_floor_details();

      frame.find('.plan_frame.n0 .plan_frame_centrer_position').transitionStop(true).transition(get_floor_css(directions,0,1), time, function() {
        load_floor_map($(this),time,directions);
      });
      if (!no_history) {
        change_url('floor');
      }
    }
    function load_floor_details() {
      if (!data.living.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+plans_current_values.f]) {
        plans_current_values.f = get_exist_floor(plans_current_values.f, -1);
      }
      if (data.living.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+plans_current_values.f].at==0) {
        plans_current_values.f = get_near_floor(plans_current_values.f);
      }

      test_next_btn(plans_current_values.sect_sel.find('.sect_left'), get_closest_section(plans_current_values.s, -1));
      test_next_btn(plans_current_values.sect_sel.find('.sect_right'), get_closest_section(plans_current_values.s, 1));
      test_next_btn(plans_current_values.floor_sel.find('.floor_down'), get_closest_floor(plans_current_values.f, -1));
      test_next_btn(plans_current_values.floor_sel.find('.floor_up'), get_closest_floor(plans_current_values.f, 1));

      plans_current_values.sect_sel.find('.val').text(plans_current_values.s);
      plans_current_values.floor_sel.find('.val').text(plans_current_values.f);
    }
    function load_floor_map(fr,time,directions) {
      var floor_id=plans_current_values.b+'-'+plans_current_values.s+'-'+plans_current_values.f;
      var current_html=fr.data('targ');
      var d1 = $.Deferred();
      $.when(d1).done(function() {
        frame.removeClass('opened_apart closed_floor').addClass('opened_floor');
        plans_current_values.apart_details.removeClass('active');
        fr.css(get_floor_css(directions,null,-1)).transition(get_floor_css(null,1,0), time);
      });
      if(floor_id==current_html) {
        d1.resolve();
      } else {
        fr.data('targ',floor_id).load('/hydra/floors/'+floor_id+'.html', function() {
          var apart_popups_html='';
          var av_rooms_list=[];
          var av_rooms_html='';
          var img=fr.find('.floor_map');
          var w=img.attr('width');
          var h=img.attr('height');
          img.on('load',function() {
            $(this).off('load');
            d1.resolve();
          });
          fr.find('.floor_map_cont').area2svg({
            'opacity': 0,
            'width': w,
            'height': h,
            'cursor': 'default',
            click: function (el) {
              if (el.st==1) {
                load_apart(el.alt, 0);
              }
            },
            mouseover: function (el) {
              if(!plans_current_values.n) {
                if (el.st==1) {
                  el.bottom.stop().animate(200).attr({'opacity': 1});
                  fr.find('.apart_popup.n'+el.alt).addClass('hover');
                }
                load_apart_details(el.alt);
              }
            },
            mouseout: function (el) {
              if (el.st==1) {
                el.bottom.stop().animate(200).attr({'opacity': 0.5});
                fr.find('.apart_popup.n'+el.alt).removeClass('hover');
              }
              plans_current_values.apart_details.removeClass('active');
            },
            each: function (el) {
              var d = data.living.apartments[el.alt];
              if (!d || d.st != 1) {
                if (!d) {
                  d = {};
                  d.st = 0;
                  console.log('null data at '+el.alt);
                }
                el.bottom.attr({'opacity': 0});
                if($.inArray(-1,av_rooms_list)==-1) {
                  av_rooms_list.push(-1);
                }
              } else {
                el.bottom.attr({'opacity':0.5,'fill':rc_color(d.rc)});
                el.attr({'cursor': 'pointer'});
                if($.inArray(d.rc,av_rooms_list)==-1) {
                  av_rooms_list.push(d.rc);
                }
                //var box=el.bbox();
                var box = el.getCentroid();
                apart_popups_html+='<div class="apart_popup css_ani n'+el.alt+'" style="top:'+(100*box.cy/h)+'%;left:'+(100*box.cx/w)+'%;">'+d.n+'</div>';
              }
              el.st=d.st;
            }
          });
          fr.find('.floor_map').after(apart_popups_html);
          apart_popups_html=null;
          av_rooms_list.sort();
          $.each(av_rooms_list,function(index,value){
            if(value==-1) {
              av_rooms_html+='<span class="rc_help sold"><span class="rc_help_icon"></span>Не в продаже</span>';
            } else {
              av_rooms_html+='<span class="rc_help sale rc'+value+'" data-targ="'+value+'"><span class="rc_help_icon"></span>'+value+' комнат'+word_end(value)+'</span>';
            }
          });
          frame.find('.floor_help').html(av_rooms_html)
            .find('.sale').each(function(){
            $(this).find('.rc_help_icon').css({'background-color':rc_color($(this).data('targ'))});
          });
          av_rooms_html=null;
          apart_popups_html=null;
        });
      }
    }

    function load_apart_details(alt) {
      var d = data.living.apartments[alt];
      plans_current_values.apart_details.addClass('active');
      if (d && d.st==1) {
        plans_current_values.apart_details.removeClass('not-sale')
          .find('[data-targ="n"] .val').text(d.n).end()
          .find('[data-targ="rc"]').html('<div class="val">'+d.rc+'</div>комнат'+word_end(d.rc)).end()
          .find('[data-targ="sq"] .val').html(d.sq).end()
          .find('[data-targ="tc"] .val').text(addspace(d.tc));
      } else {
        plans_current_values.apart_details.addClass('not-sale');


      }
    }
    function load_apart_img(img_frame, src, time) {
      img_frame.transitionStop(true).transition({'opacity':0},time,function(){
        img_frame.html('<img class="apart_img" src="'+src+'" />')
          .find('.apart_img').css({'translate3d':0}).on('load',function() {
          img_frame.transitionStop(true).transition({'opacity':1},time);
          $(this).off('load');
          frame.removeClass('opened_floor closed_floor').addClass('opened_apart');
          if (apart_zoom) {
            apart_zoom.loadImg();
            apart_zoom.setOn();
          }
        });
      })
    }
    function load_apart(time, no_history) {
      plans_current_values.n = alt;
      load_apart_img(frame.find('.plan_frame.n1 .plan_frame_centrer_position'), '/hydra/apts/'+plans_current_values.n+'.png', time);

      frame.find('.plans_close').data('targ', param_search_url);
      if (!no_history) {
        change_url('flat');
      }
      frame.find('.fav_btn').toggleClass('active', checkFavourite(plans_current_values.n));
    }






    function rc_color(param) {
      var colors= {
        0:'#ed793e',
        1:'#f7ea21',
        2:'#92c250',
        3:'#16a1dd'
      };
      return colors[param];
    }
    function test_floors(where) {
      var rooms_av = [];
      frame.find('.rooms_sel.active').each(function() {
        rooms_av.push(Number($(this).data('targ')));
      });
      svg_paper_bg.forEach(function (el) {
        var at = 0;
        var floor_data = where[plans_current_values.b+'-'+el.alt];
        if (floor_data) {
          if (rooms_av.length) {
            $.each(rooms_av, function (index, value) {
              at += floor_data.arc[value];
            });
          } else {
            at += floor_data.at;
          }
        }
        el.at=at;
        if (at != 0) {
          el.bottom.stop().animate(200).attr({'opacity': 1});
          el.attr({'cursor': 'pointer'});
        } else {
          el.bottom.stop().animate(200).attr({'opacity': 0});
          el.attr({'cursor': 'default'});
        }
      });
    }
    function plan_check_size() {
      frame.find('.plan_frame_centrer').each(function(){
        var fr = $(this);
        var fr2 = fr.parent();
        var apart_ratio = $(this).data('targ')||1;
        var fr2_w=fr2.width();
        var fr2_h=fr2.height();
        var plan_size = Math.min(fr2_w / apart_ratio, fr2_h);
        fr.css({'width': plan_size * apart_ratio, 'height': plan_size, 'margin-top': 0.5 * (fr2_h-plan_size), 'margin-left':0.5 * (fr2_w-plan_size * apart_ratio)});
      })
    }
    function change_url(type) {
      var url='/plans';
      if(type=='korpus') {
        url+='/korpus'+plans_current_values.b;
      } else
      if(type=='floor') {
        url+='/korpus'+plans_current_values.b+'/section'+plans_current_values.s+'/floor'+plans_current_values.f;
      } else
      if(type=='flat') {
        url+='/korpus'+plans_current_values.b+'/section'+plans_current_values.s+'/floor'+plans_current_values.f+'/flat'+data.living.apartments[plans_current_values.n].n;
      }
      pjax.loadPage(url, {'suppress_load': true});
    }
    function get_floor_css(directions,opacity,direction) {
      var css={};
      if(directions) {
        css=get_transition_css(direction*10*directions[0]+'%',direction*10*directions[1]+'%');
      } else
      if(direction==0) {
        css=get_transition_css('0%','0%');
      }
      if(opacity!==null) {
        css.opacity=opacity;
      }
      return css;
    }
    function test_next_btn(btn,val) {
      if (val==null) {
        btn.removeClass('active');
      } else {
        btn.addClass('active').data('targ',val);
      }
    }
    function get_exist_floor(floor,delta) {
      floor+=delta;
      if (data.living.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor]) {
        return floor;
      } else {
        return get_exist_floor(floor,delta);
      }
    }
    function get_closest_floor(floor,delta,i) {
      floor+=delta;
      if(i==undefined) {
        i=0;
      } else {
        i++;
      }
      if (i>20) {
        return null;
      } else
      if (data.living.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor] && data.living.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor].at!=0) {
        return floor;
      } else {
        return get_closest_floor(floor,delta,i)
      }
    }
    function get_near_floor(floor) {
      var floor_down=get_closest_floor(floor, -1);
      var floor_up=get_closest_floor(floor, 1);
      var result=null;
      if((floor_up && !floor_down) || (floor_up && floor_down && floor_up-floor<floor-floor_down)) {
        result=floor_up;
      } else
      if(floor_down) {
        result=floor_down;
      }
      return result;
    }
    function get_closest_section(section,delta,i) {
      section+=delta;
      if(i==undefined) {
        i=0;
      } else {
        i++;
      }
      if (i>20) {
        return null;
      } else
      if (data.living.sections[plans_current_values.b+'-'+section] && data.living.sections[plans_current_values.b+'-'+section].at!=0) {
        return section;
      } else {
        return get_closest_section(section,delta,i)
      }
    }
    function load_floor_animation(options) {
      var direction_floor=0;
      var direction_section=0;
      if(options.floor!=undefined) {
        var floor_next=Number(options.floor);
        if(floor_next<plans_current_values.f) {
          direction_floor=-1
        } else {
          direction_floor=1;
        }
        plans_current_values.f=floor_next;
      }
      if(options.section!=undefined) {
        var section_next=Number(options.section);
        if(section_next>plans_current_values.s) {
          direction_section=-1
        } else {
          direction_section=1;
        }
        plans_current_values.s=section_next;
      }
      load_floor(300,null,[direction_floor,direction_section]);
    }


    frame
      .on('click', '.rooms_sel', function() {
        $(this).toggleClass('active').siblings('.active').removeClass('active');
        test_floors(data.living.floors);
      })
      .on('click', '.sect_left.active, .sect_right.active', function() {
        load_floor_animation({
          section:$(this).data('targ')
        });
      })
      .on('click', '.floor_down.active, .floor_up.active', function() {
        load_floor_animation({
          floor:$(this).data('targ')
        });
      })
      .on('click', '.pdf_btn', function() {
        window.open('/assets/php/pdf.php?id='+plans_current_values.n, '_blank');
      })
      .on('click', '.plans_close', function() {
        var targ_search_url=$(this).data('targ');
        if(targ_search_url) {
          pjax.loadPage($(this).data('targ'));
        } else
        if(plans_current_values.n) {
          load_floor(0);
        } else {
          floor_frame_hide();
        }
      })
      .on('click', '.calculate_btn', function() {
        frame2.openPopup({
          template: 'calculator',
          beforeOpen: function (popup) {
            var calc_result_frame=popup.find('.calc_result_frame span');
            mortgage_calculator=popup.mortgageCalculator({
              cost:{
                min: 1000000,
                max: 10000000,
                current: data.living.apartments[plans_current_values.n].tc,
                step: 50000,
                round: 1000000,
                txt: ' млн руб.'
              },
              onUpdate:function(values){
                //console.log(values);
                calc_result_frame.text(addspace(Math.round(values.pay_month)));
              }
            });
          },
          afterClose: function (popup) {
            mortgage_calculator=unloadPlugin(mortgage_calculator);
          }
        });
      })
      .on('click', '.fav_btn', function() {
        if($(this).hasClass('active')) {
          $(this).removeClass('active');
          removeFavourite(plans_current_values.n);
        } else {
          $(this).addClass('active');
          addFavourite(plans_current_values.n);
        }
      });
  }())}
  if(targ=="mop") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(gallery);
    };

    var scroll_pos = 0;

    var gallery_frame = frame.find('.gallery_place');
    var gallery = gallery_frame.galleryInit({
      images: gallery_images,
      start_num: 0,
      dots: true,
      loadComplete: function() {
        frame.find('.wait-load').remove();
      },
      afterMove: function(cur_num, prev_num) {
        frame.find('.about__text-frame').addClass('folded');
      }
    });


    frame
      .on('click', '.about__text-close', function() {
        $(this).parents('.about__text-frame').addClass('folded');
      })
      .on('click', '.about__text-frame.folded', function() {
        $(this).removeClass('folded');
      })
      .on('mousewheel', function(e, delta) {
        scroll_pos += delta;
        if(Math.abs(scroll_pos) > 5) {
          var arrow = scroll_pos > 0 ? 'right' : 'left';
          gallery.move(arrow);
          scroll_pos = 0;
        }
      });
  }())}
  if(targ=="news") {(function(){
    page.unset=function(){
      frame.off();
    };

    var $news_list = frame.find('.news_content');
    var $news_items = $news_list.find('.news_item');
    var $news_popup = frame.find('.news_popup');
    var $active = $news_items.filter('.active');
    var active = 0;

    active = $news_items.index($active);

    function update_arrows(num){
      $news_popup.find('.vertical__arrow').removeClass('active inactive')
        .filter('.prev').addClass((num > 0)? 'active' : 'inactive').end()
        .filter('.next').addClass((num < $news_items.length - 1)? 'active' : 'inactive').end()
    }

    function article_loaded(){
      var social_settings = {};
      social_settings.title = $news_popup.find('.article_title').text();
      $news_popup.find('.article_text p').eq(0).each(function(){
        var description = $(this).text();
        social_settings.description = description;
      });
      $news_popup.find('img').eq(0).each(function(){
        var $image = $(this);
        social_settings.image = $image.attr('data-targ') || $image.attr('src');
      });
      update_social(social_settings);
    }

    function load_article($item){
      if($item.hasClass('active')) return;
      var delay = 0;
      var url = $item.attr('href');
      $item.addClass('active').siblings().removeClass('active');
      $active = $item;
      active = $news_items.index($item);
      pjax.loadPage(url, {'suppress_load': true});
      add_stat(url);
      if($news_popup.hasClass('visible')){
        $news_popup.removeClass('visible');
        delay = 1000;
      }
      var jqXHR = $.ajax({
        url: '/ajax/news_load',
        dataType: 'html',
        data: {url: url},
        success: function (response) {
          var $article_scroll = $news_popup.find('.text_scroll');
          delay = Math.max(delay - (new Date() * 1 - jqXHR.timestamp), 0);
          setTimeout(function(){
            update_arrows(active);
            if($article_scroll.data('plugin')) {
              $article_scroll.data('plugin').loadHtml(response, 0);
            } else {
              $article_scroll.html(response).scrollTop(0);
            }
            setTimeout(article_loaded, 50);
            $news_popup.addClass('visible');
          }, delay);
        }
      });
      jqXHR.timestamp = new Date() * 1;
    }

    if($news_popup.hasClass('visible')){
      article_loaded();
    }

    frame
      .on('click', '.news_menu_item', function(e){
        var $item = $(this);
        var href = $item.attr('href');
        e.preventDefault();
        if($item.hasClass('active')) return;
        pjax.loadPage(href);
      })
      .on('click', '.news_item', function(e) {
        e.preventDefault();
        load_article($(this));
      })
      .on('click', '.vertical__arrow', function(){
        var $arrow = $(this);
        if(!$arrow.hasClass('active')) return;
        $news_items.eq(active + ($arrow.hasClass('prev')? -1 : 1)).trigger('click');
      })
      .on('click', '.news_popup_close', function(){
        var url = $(this).data('targ');
        $news_popup.removeClass('visible');
        $news_list.find('.news_item.active').removeClass('active');
        pjax.loadPage(url, {'suppress_load': true});
        add_stat(url);
      })
      .on('click', '.news_img_tmb', function () {
        var images = $(this).parent().data('images').split(',');
        var start_num = $.inArray($(this).data('targ'), images);
        images=images.map(function(item){
          return {src: item};
        });
        open_popup_gallery({
          bg_style: 'cover',
          images: images,
          start_num: start_num,
          frame: frame2
        });
      });


    update_arrows(active);
    (function(){
      if(!pages_info.previous || pages_info.previous.type === 'news') return;
      $news_list
        .css({'y': '100%'})
        .transition({'y': '0%'}, 1000);
      $news_popup
        .css({'x' : '100%', 'display' : 'none'})
        .delay(500).queue(function(next){
        next();
        $news_popup.css({'display': 'block'});
        if($news_popup.find('.text_scroll').data('plugin'))  $news_popup.find('.text_scroll').data('plugin').reinitialise();
        $news_popup.transition({'x': '0%'}, 1000, function(){
          $news_popup.removeAttr('style');
        });
      });
    })();
  }())}
  if(targ=="parking") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(param_search);
      pcv = plans_current_values = {};
    };

    page.resize = function() {
      element_scale_inside(frame.find('.plans__image'), 1.78);
      plan_check_size();

      plan_drag_w = plan_drag.width();
      plan_drag_h = plan_drag.height();
      plan_drag_fr_w = plan_drag_fr.width();
      plan_drag_fr_h = plan_drag_fr.height();
    };

    var param_search, svg_paper_bg, svg_paper_floor;
    var plans_info = frame.find('.plans_info');

    var plans_slider = frame.find('.plans__slider'),
      plans_frame = frame.find('.plans-frame'),
      korpus_frame = frame.find('.korpus-frame'),
      floor_frame = frame.find('.plans__floor-frame'),
      back_btn = frame.find('.plans__back'),
      bullets = frame.find('.slideshow__bullet'),
      stage = 0,
      stages_names = ['Выбор корпуса', 'Выбор машиноместа'],
      stages_classes = ['opened_plans', 'opened_floor', 'opened_apart'],
      apart_opacity = [0.2, 0.7],
      encode_string = '';

    var floor_rose_angle = korpus_frame.find('.plans__image-wrapper').data('floor-rose') || 0;

    plans_current_values.type = 'parking';
    plans_current_values.floor_sel = floor_frame.find('.plans__floor-label');
    plans_current_values.apart_details = floor_frame.find('.apart_details_frame');

    pcv.b = plans_info.data('korpus');
    pcv.s = 1;
    pcv.f = plans_info.data('floor');
    pcv.n = plans_info.data('flat');
    if(pcv.n) pcv.id = pcv.b + '-' + pcv.n;

    var filtered = [];

    var plan_drag = frame.find('.plan_draggable');
    var plan_drag_fr = plan_drag.parent();

    var plan_drag_w = plan_drag.width(),
      plan_drag_h = plan_drag.height(),
      plan_drag_t = 0,
      plan_drag_l = 0;

    var plan_drag_fr_w = plan_drag_fr.width(),
      plan_drag_fr_h = plan_drag_fr.height();

    rotateWindrose(plans_frame.find('.windrose'), -150);

    test_json('parking', function() {
      svg_paper_bg = plans_frame.find('.plans_map_cont').area2svg({
        'opacity': 0,
        'fill': '#01a8b7',
        'fill-opacity': 1,
        'stroke-opacity': 0,
        'width' : 1920,
        'height' : 1080,
        click: function (el) {
          if (el.data('active')) {
            plans_current_values.b = Number(el.alt);
            change_stage({'stage' : 1});
          }
        },
        mouseover: function (el) {
          if(el.data('active')) frame.find('.plans__korpus-bubble[data-targ="' + el.alt + '"]').trigger('mouseenter').addClass('hover');
        },
        mouseout: function (el) {
          if(el.data('active')) frame.find('.plans__korpus-bubble[data-targ="' + el.alt + '"]').trigger('mouseleave').removeClass('hover');
        },
        each: function (el) {
          el.attr({'fill': '#01a8b7'});
        }
      });

      frame.find('.plans__korpus-bubble').each(function() {
        var $bubble = $(this);
        var korp_num = $bubble.attr('data-targ');

        $bubble.html('' +
          '<div class="label flats-count"></div>' +
          '<div class="plans__korpus-bubble-num"><span>' + get_korp_num(korp_num) + '</span></div>'
        );
      });

      var search_hash=frame.find('.search_hash').data('hash');
      var search_values={};

      frame.find('.search_buttons_dropdown.generated').each(function(){
        var $buttons_frame = $(this).find('.search_buttons_frame');
        var name = $buttons_frame.attr('data-targ');
        var values = '';
        $.each(data.parking.apartments, function(id, apart){
          if(apart.st == 1 && apart[name]) values += ',' + apart[name];
        });
        var filters = values.split(',').reduce(function(filters, value){
          value = value.trim();
          if(value) filters[value] = true;
          return filters;
        }, {});
        filters = Object.keys(filters).sort();
        if(!filters.length) $(this).remove();
        else {
          $buttons_frame.html(filters.reduce(function(html, value){
            return html += '<div class="search_buttons" data-targ="' + value + '"><span>' + value.capitalizeFirst() + '</span></div>';
          }, ''));
        }
      });

      if(search_hash ) {
        var split_hash=search_hash.split('&');
        $.each(split_hash,function(index,value){
          var split_value=value.split('=');
          if(/active/.test(split_value[0])) {
            search_values[split_value[0]]=split_value[1];
          } else
          if(/-/.test(split_value[1])) {
            var split_value2=split_value[1].split('-');
            search_values[split_value[0]]={};
            search_values[split_value[0]].v_l=Number(split_value2[0]);
            search_values[split_value[0]].v_r=Number(split_value2[1]);
          } else {
            var split_value2 = split_value[1].split(',');
            search_values[split_value[0]]= split_value2.map(function(value){
              return isNaN(Number(value))? value : Number(value);
            });
          }
        })
      }

      param_search = frame2.searchInit({
        data: data.parking.apartments,
        paramChange: function(val){
          encode_string = '';
          $.each(val, function(index, value){
            encode_string += index + '=';
            if(typeof value === 'string') {
              encode_string += value;
            } else
            if($.isPlainObject(value)) {
              encode_string += value.v_l + '-' + value.v_r;
            } else {
              encode_string += value.join();
            }
            encode_string += '&';
          });
          encode_string = encode_string.slice(0, -1);
          // sessionStorage['search_hash'] = encode_string;
          pjax.loadPage((pjax.getPathname() + '').split('?')[0] + '?' + encode_string, {'suppress_load' : true});
        },
        afterSearch: function(result) {
          if(stage === 0) filter_buildings(result);
          else if(svg_paper_floor) update_apartments();
          filtered = result;
        },
        start_values: search_values,
        no_output: true,
        htmlNoLoad: true,
        pagination: 0
      });

      function change_stage(opt) {
        if(opt.delta) {
          stage += opt.delta;
        } else
        if(Number(opt.stage) === 0 || opt.stage) {
          stage = opt.stage;
        }

        switch (stage) {
          case 0:
            pcv.b = pcv.s =  pcv.f = null;
            change_stage_details();
            break;
          case 1:
            pcv.s = 1;
            pcv.f = pcv.f || (get_closest_floor(0, 1) ? get_closest_floor(0, 1) : 1);//
            pcv.n = pcv.id = null;
            pcv.apart_details.removeClass('active');
            load_korpus(function() {
              load_floor(300, false, false, change_stage_details);
            });
            break;
          case 2:
            load_korpus(function() {
              load_floor(300, false, false, function(){
                change_stage_details();
                load_apart_details(pcv.id);
              });
            });
            break;
          default:
            break;
        }

        if(!opt.no_history) change_url();
      }

      function change_stage_details() {
        param_search.forceSearch();

        plans_slider.transitionStop(true).transition({'x' : - (stage < 1 ? 0 : 1) * 100 + '%'}, 800, easyInOut);

        back_btn.toggleClass('hidden', stage === 0).find('.plans__back-label span').html(stages_names[stage - 1] ? stages_names[stage - 1] : '&nbsp;');
        bullets
          .filter('[data-targ="' + stage + '"]').attr('class', 'slideshow__bullet active')
          .prevAll('.slideshow__bullet').attr('class', 'slideshow__bullet').end()
          .nextAll('.slideshow__bullet').attr('class', 'slideshow__bullet inactive');

        frame.find('.plans__frame').attr('class', 'plans__frame ' + stages_classes[stage]);
      }

      function change_url() {
        var url = '/parking';

        switch (stage) {
          case 1:
            url += '/korpus' + pcv.b + (pcv.f ? '/floor' + pcv.f : '');
            break;
          case 2:
            url += '/korpus' + pcv.b + '/floor' + pcv.f + '/flat' + pcv.n;
            break;
          default:
            break;
        }
        pjax.loadPage(url + (encode_string ? '?' + encode_string : ''), {'suppress_load' : true});
      }

      function filter_buildings(result) {
        var active_bs = {};

        for(var i = 0, l = result.length; i < l; i ++) {
          var d = data.parking.apartments[result[i]];
          if(!active_bs[d.b]) active_bs[d.b] = 0;
          active_bs[d.b] ++;
        }
        console.log('active_bs', active_bs);
        frame.find('.plans__korpus-bubble').each(function() {
          var $bubble = $(this);
          var dt = $bubble.data('targ');
          var count = active_bs[dt] || 0;


          $bubble.toggleClass('active', !!1).find('.flats-count').text('Найдено: ' + count);
          /*if($bubble.data('targ') == 40){
                $bubble.toggleClass('active', !!1).find('.flats-count').text(count+': найдено');
            }*/
          svg_paper_bg.getByAlt(dt)[0].stop(true).animate(300).attr({'opacity' : count? 0.33 : 0, 'cursor' : 'pointer'});
          svg_paper_bg.getByAlt(dt)[0].data('active', 1/*count? 1 : 0*/);
        });
      }

      function filter_aparts(result) {
        var apart_help = [0, 0],
          apart_help_html = '',
          apart_help_text = ['Другие м/м в продаже', 'Подходящие м/м'];

        svg_paper_floor.forEach(function(el) {
          var alt = el.alt;

          if(($.inArray(alt, result) + 1) && el.st) {
            el.bottom.attr({'opacity' : apart_opacity[1]});
            el.data('active', 1);
            apart_help[1] += 1;
          } else
          if(el.st) {
            el.bottom.attr({'opacity' : apart_opacity[0]});
            el.data('active', 0);
            apart_help[0] += 1;
          }
        });
        for(var i = 1; i >= 0; i --) {
          if(apart_help[i]) apart_help_html += '<div class="apart__help"><div class="apart__help-icon" style="opacity: ' + apart_opacity[i] + ';"></div><span>' + apart_help_text[i] + '</span></div>';
        }
        frame.find('.apart__help-frame').html(apart_help_html);
      }

      function get_sections(b){
        var sections = {};
        $.each(data.parking.floors, function(id, floor){
          var parsed = id.split('-');
          if(parsed[0] == b) sections[Number(parsed[1])] = true;
        });
        return Object.keys(sections).sort();
      }

      function load_korpus(callback) {
        function onLoad(){
          preloader.hide();
          page.resize();
          floor_rose_angle = korpus_frame.find('.plans__image-wrapper').data('floor-rose');
          rotateWindrose(korpus_frame.find('.windrose'), korpus_frame.find('.plans__image-wrapper').data('rose'));
          callback();
        }

        var loaded = korpus_frame.data('b');
        if(plans_current_values.b === loaded) return onLoad();

        preloader.show();
        $.ajax({
          url: '/ajax/korpus_load?b=' + plans_current_values.b + '&type=parking',
          success: function(response) {
            korpus_frame.data('b', plans_current_values.b).html(response);
            korpus_frame.find('.wait-load').on('load', function() {
              onLoad();
            });
            // load_korpus_map();
          }
        });
      }

      function load_floor(time, no_history, directions, callback){
        var loaded = floor_frame.data('f');
        var floor_id = pcv.b + '-' + pcv.s + '-' + pcv.f;
        load_floor_details();
        if(loaded === floor_id){
          update_apartments();
          return callback();
        }
        floor_frame.data('f', floor_id);
        frame.find('.plan_frame.n0 .plan_frame_centrer_position').transitionStop(true).transition(get_floor_css(directions,0,1), time, function() {
          load_floor_map($(this), time, directions, callback);
        });
      }

      function load_floor_map(fr, time, directions, callback) {
        var floor_id = plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f,
          current_html = fr.data('targ'),
          d1 = $.Deferred();

        preloader.show();

        $.when(d1).done(function() {
          preloader.hide();
          // plans_current_values.apart_details.removeClass('active');
          fr.css(get_floor_css(directions,null,-1)).transition(get_floor_css(null,1,0), time);
          if(callback) callback();
        });

        if(floor_id == current_html) {
          d1.resolve();
        } else {
          fr.data('targ', floor_id).find('.plan_draggable').load('/hydra/park/floors/' + floor_id + '.html', function() {
            // var apart_popups_html='';
            var img=fr.find('.floor_map');
            var w=img.attr('width');
            var h=img.attr('height');
            img.on('load',function() {
              $(this).off('load');
              d1.resolve();
            });
            svg_paper_floor = fr.find('.floor_map_cont').area2svg({
              'opacity': 0,
              'width': w,
              'height': h,
              'cursor': 'default',
              click: function (el) {
                if(!el.selected && !el.filtered) return;
                if(pcv.id && pcv.id !== el.alt){
                  svg_paper_floor.getByAlt(pcv.id).each(function(index, el){
                    el.selected = el.hovered = false;
                    update_apart_state(el);
                  });
                }
                el.selected = !el.selected;
                update_apart_state(el);
                if(!el.selected){
                  pcv.n = pcv.id = null;
                } else {
                  pcv.id = el.alt;
                  pcv.n = el.n;
                }
                change_stage({'stage' : el.selected? 2 : 1});
              },
              mouseover: function (el) {
                if(!el.filtered) return;
                el.hovered = true;
                update_apart_state(el);
                load_apart_details(el.alt);
                pcv.apart_details.addClass('active');
              },
              mouseout: function (el) {
                if(el.alt === pcv.id || !el.filtered) return;
                el.hovered = false;
                update_apart_state(el);
                if(pcv.id) load_apart_details(pcv.id);
                else pcv.apart_details.removeClass('active');
              },
              each: function(el){}
            });
            update_apartments();
          });
        }
      }

      function update_apartments(){
        svg_paper_floor.forEach(function(el){
          var apart = data.parking.apartments[el.alt] || {st : 0};
          el.filtered = filtered.indexOf(el.alt) > -1;
          el.selected = (el.alt === pcv.id);
          el.hovered = false;
          el.n = apart.n;
          el.st = apart.st;
          update_apart_state(el);
        });
      }

      function update_apart_state(el){
        var attrs = {'cursor': 'default', 'fill': '#c1d72e', 'opacity' : 0.8};
        if(el.selected){
          // attrs.opacity = 0.2;
          attrs.fill = '#01a8b7';
        } else if(el.hovered){
          // attrs.opacity = 0.2;
          attrs.fill = '#01a8b7';
          attrs.cursor = 'pointer';
        } else if(el.filtered){
          // attrs.opacity = 0.2;
          var d = data.parking.apartments[el.alt];
          //console.log(data.parking.apartments,pcv.b,d);
          if(d.full_type == 'Место хранения'){
            attrs.fill ='#fad719';
          }
          attrs.cursor = 'pointer';
        } else {
          attrs.opacity = 0;
        }
        el.attr({'cursor' : attrs.cursor});
        el.bottom.attr({'fill' : attrs.fill, 'opacity' : attrs.opacity});
      }

      function load_floor_details() {
        rotateWindrose(floor_frame.find('.windrose'), floor_rose_angle, 300);
        test_next_btn(plans_current_values.floor_sel.find('.floor_up'), get_closest_floor(plans_current_values.f, ((plans_current_values.b!=40) ? -1 : 1)));
        test_next_btn(plans_current_values.floor_sel.find('.floor_down'), get_closest_floor(plans_current_values.f, ((plans_current_values.b!=40) ? 1 : -1)));
        plans_current_values.floor_sel.find('.n2').text(((plans_current_values.b!=40) ? '-' : '') + (plans_current_values.f > 9 ? plans_current_values.f : '0' + plans_current_values.f));
        if(plans_current_values.b==40 && plans_current_values.f == 9){
          plans_current_values.floor_sel.find('.n2').append('<span class="label_parking">Кровля</span>');
        } else {
          plans_current_values.floor_sel.find('.n2 .label_parking').remove();
        }
      }

      function load_apart_details(alt) {
        var d = data.parking.apartments[alt];
        plans_current_values.apart_details.addClass('active');
        if (d && d.st === 1) {
          plans_current_values.apart_details.removeClass('not-sale')
            .find('[data-targ="n"] .val').text(d.tn).end()
            .find('[data-targ="rc"] .val').text(d.rc).end()
            .find('[data-targ="sq"] .val').text(Math.round(d.sq * 10) / 10).end()
            .find('[data-targ="tc"] .val').text(Math.round(d.tc / 10000) / 100);
          if(d.full_type == 'Место хранения'){
            plans_current_values.apart_details.find('[data-targ="n"] span.moto').show();
          } else {
            plans_current_values.apart_details.find('[data-targ="n"] span.moto').hide();
          }

        } else {
          plans_current_values.apart_details.addClass('not-sale');
        }
      }

      function get_floor_css(directions,opacity,direction) {
        var css = {};
        if(directions) {
          css = get_transition_css(direction*10*directions[0]+'%',direction*10*directions[1]+'%');
        } else
        if(direction == 0) {
          css = get_transition_css('0%','0%');
        }
        if(opacity !== null) {
          css.opacity = opacity;
        }
        return css;
      }

      function test_next_btn(btn,val) {
        if (val==null) {
          btn.removeClass('active');
        } else {
          btn.addClass('active').data('targ',val).find('span').text( ((plans_current_values.b!=40) ? '-' : '') + (val < 10 ? '0' + val : val));
        }
      }

      function get_exist_floor(floor,delta) {
        floor+=delta;
        if(floor > 20) return;
        if (data.parking.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor]) {
          return floor;
        } else {
          return get_exist_floor(floor,delta);
        }
      }

      function get_closest_floor(num, delta, i) {
        num += delta;
        i = i || 0;
        i += 1;
        if(i > 20) return null;
        var floor = data.parking.floors[pcv.b + '-' + pcv.s + '-' + num] || {at: 0};
        if(floor.at) return num;
        return get_closest_floor(num, delta, i + 1)
      }

      function get_near_floor(floor) {
        var floor_down=get_closest_floor(floor, -1);
        var floor_up=get_closest_floor(floor, 1);
        var result=null;
        if((floor_up && !floor_down) || (floor_up && floor_down && floor_up-floor<floor-floor_down)) {
          result=floor_up;
        } else
        if(floor_down) {
          result=floor_down;
        }
        return result;
      }
      function get_closest_section(section,delta,i) {
        section+=delta;
        if(i==undefined) {
          i=0;
        } else {
          i++;
        }
        if (i>20) {
          return null;
        } else
        if (data.parking.sections[plans_current_values.b+'-'+section] && data.parking.sections[plans_current_values.b+'-'+section].at!=0) {
          return section;
        } else {
          return get_closest_section(section,delta,i)
        }
      }
      function load_floor_animation(options) {
        var direction_floor=0;
        var direction_section=0;
        if(options.floor!=undefined) {
          var floor_next=Number(options.floor);
          if(floor_next<plans_current_values.f) {
            direction_floor=-1
          } else {
            direction_floor=1;
          }
          plans_current_values.f=floor_next;
        }
        if(options.section!=undefined) {
          var section_next=Number(options.section);
          if(section_next>plans_current_values.s) {
            direction_section=-1
          } else {
            direction_section=1;
          }
          plans_current_values.s=section_next;
        }
        load_floor(300,null,[direction_floor,direction_section], param_search.forceSearch);
        change_url();
      }

      if(plans_info.data('stage')) {
        change_stage({'stage' : plans_info.data('stage'), 'no_history' : true});
      }

      frame
        .on('click', '.search_buttons_title', function() {
          var that = $(this);

          that
            .toggleClass('active')
            .siblings('.search_buttons_hidden').transitionToggleHeight(that.hasClass('active'), 500, function() {
            frame.find('.plans__filters').data('plugin').reinitialise({fix_position:true});
          });
        })
        .on('click', '.plans__korpus-bubble', function() {
          if($(this).hasClass('active')) {
            plans_current_values.b = Number($(this).data('targ'));
            change_stage({'stage' : 1});
          }
        })
        .on('mouseenter', '.plans__korpus-bubble', function() {
          if($(this).hasClass('active')) {
            svg_paper_bg.getByAlt($(this).data('targ'))[0].stop(true).animate(100).attr({'fill' : '#ffffff'});
          }
        })
        .on('mouseleave', '.plans__korpus-bubble', function() {
          if($(this).hasClass('active')) {
            svg_paper_bg.getByAlt($(this).data('targ'))[0].stop(true).animate(100).attr({'fill' : '#01a8b7'});
          }
        })
        .on('click', '.plans__back', function(){
          var url = $(this).data('url');
          if(url){
            pjax.loadPage(url);
          } else {
            change_stage({'delta' : -1});
          }
        })
        .on('click', '.slideshow__bullet', function() {
          if(!$(this).hasClass('active') && !$(this).hasClass('inactive')) {
            change_stage({'stage' : $(this).data('targ')});
          }
        })
        .on('click', '.floor_down.active, .floor_up.active', function() {
          load_floor_animation({
            floor:$(this).data('targ')
          });
        })
        .on('click', '.pdf_btn', function() {
          window.open('/assets/php/pdf.php?t=p&id=' + pcv.id, '_blank');
        });
    });

    function plan_check_size() {
      frame.find('.plan_frame_centrer').each(function(){
        var fr = $(this);
        var fr2 = fr.parent();
        var apart_ratio = $(this).data('targ')||1;
        var fr2_w=fr2.width();
        var fr2_h=fr2.height();
        var plan_size = Math.min(fr2_w / apart_ratio, fr2_h);
        fr.css({'width': plan_size * apart_ratio, 'height': plan_size, 'margin-top': 0.5 * (fr2_h-plan_size), 'margin-left':0.5 * (fr2_w-plan_size * apart_ratio)});
      })
    }

    function toggle_zoom(enable) {
      if(!enable) {
        plan_drag.css({'top' : 0, 'left' : 0});
      }

      plan_drag_fr.toggleClass('draggable', enable);
      frame.find('.parking__zoom-button').toggleClass('active', enable);
    }

    plan_drag.hammer()
      .on('panstart', function(e) {
        plan_drag_w = plan_drag.width();
        plan_drag_h = plan_drag.height();
        plan_drag_fr_w = plan_drag_fr.width();
        plan_drag_fr_h = plan_drag_fr.height();

        plan_drag_t = plan_drag.position().top;
        plan_drag_l = plan_drag.position().left;

        plan_drag.addClass('dragging');
      })
      .on('pan', function(e) {
        var x = plan_drag_l + e.gesture.deltaX,
          y = plan_drag_t + e.gesture.deltaY;

        x = Math.max(Math.min(0, x * 100 / plan_drag_fr_w), 100 - plan_drag_w * 100 / plan_drag_fr_w);
        y = Math.max(Math.min(0, y * 100 / plan_drag_fr_h), 100 - plan_drag_h * 100 / plan_drag_fr_h);

        plan_drag.css({'top' : y + '%', 'left' : x + '%'});
      })
      .on('panend', function(e) {
        plan_drag.removeClass('dragging');
      });

    frame
      .on('click', '.plans__offers-button', function() {
        $(this).parents('.plans__offers-frame').addClass('opened');
      })
      .on('click', '.plans__offers-close', function() {
        $(this).parents('.plans__offers-frame').removeClass('opened');
      })
      .on('click', '.parking__zoom-button', function() {
        toggle_zoom(!$(this).hasClass('active'));
      });
  }())}
  if(targ=="placement") {(function(){
    page.unset=function(){
      frame.off();
      map.destroy();
      unloadPlugin(route);
    };

    var route, map;

    ymaps.ready(function() {
      var obj_point = [55.682049, 37.245918];

      var map_id = 'map_' + (new Date * 1);
      frame.find('.map_place').attr('id', map_id);

      map = new ymaps.Map(
        map_id, {
          center: obj_point,
          zoom: 16,
          type: 'yandex#map',
          behaviors: ['default', 'scrollZoom']
        }, {
          searchControlProvider: 'yandex#search',
          suppressMapOpenBlock: true
        }
      );

      map.geoObjects.add(new ymaps.Placemark(obj_point, {
          hintContent: ''
        }, {
          iconLayout: 'default#image',
          iconImageClipRect: [[907, 2], [960, 75]],
          iconImageHref: '/assets/i/sprite.png',
          iconImageSize: [53, 73],
          iconImageOffset: [-26, -73]
        }
      ));

      route = frame.mapsRoute({
        map: map,
        destination: obj_point,
        input_frame: frame.find('.placement__route-frame'),
        originImage: {
          iconImageClipRect: [[965, 2], [982, 36]],
          iconImageHref: '/assets/i/sprite.png',
          iconImageSize: [17, 34],
          iconImageOffset: [-8, -34],
          cursor: 'default'
        },
        polylineOptions: {
          strokeColor: '#01a8b7',
          strokeOpacity: 1,
          strokeWeight: 6
        },
        type: 'yandex'
      });

      frame
        .on('click', '.placement__route-close', function() {
          route.setOff();
          map.setCenter(obj_point, 15);
          $(this).parents('.placement__route-frame').addClass('folded');
        })
        .on('click', '.placement__route-frame.folded', function() {
          route.setOn();
          map.setCenter(obj_point, 12);
          $(this).removeClass('folded');
        })
        .on('click', '.about__text-close', function() {
          $(this).parents('.about__text-frame').addClass('folded');
        })
        .on('click', '.about__text-frame.folded', function() {
          $(this).removeClass('folded');
        });
    });

  }())}
  if(targ=="plans") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(param_search);
      plans_current_values.n = null;
    };

    page.resize = function() {
      element_scale_inside(frame.find('.plans__image'), 1.78);
      plan_check_size();
    };

    var param_search, svg_paper_bg, svg_paper_korp, svg_paper_floor, svg_paper_floor_minimap, svg_paper_quarter_minimap;
    var plans_info = frame.find('.plans_info');

    var plans_slider = frame.find('.plans__slider'),
      plans_frame = frame.find('.plans-frame'),
      korpus_frame = frame.find('.korpus-frame'),
      floor_frame = frame.find('.plans__floor-frame'),
      back_btn = frame.find('.plans__back'),
      bullets = frame.find('.slideshow__bullet'),
      stage = 0,
      stages_names = ['Выбор корпуса', 'Выбор этажа', 'Выбор квартиры', 'Печать PDF'],
      stages_classes = ['opened_plans', 'opened_korpus', 'opened_floor', 'opened_apart'],
      apart_opacity = [0.2, 0.7],
      encode_string = '',
      korpus_reverse = false;

    var similiar_scroll;
    var $similiar_scroll = frame.find('.compare__scroll');
    var $similiar_controls = frame.find('.compare__scroll-controls');

    var floor_rose_angle = korpus_frame.find('.plans__image-wrapper').data('floor-rose') || 0;

    plans_current_values.type = 'living';
    plans_current_values.floor_sel = floor_frame.find('.plans__floor-label');
    plans_current_values.apart_details = floor_frame.find('.apart_details_frame');
    plans_current_values.b = Number(plans_info.data('korpus'));
    plans_current_values.s = Number(plans_info.data('section'));
    plans_current_values.f = Number(plans_info.data('floor'));
    if(plans_info.data('flat')) plans_current_values.n = plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f + '-' + Number(plans_info.data('flat'));

    if(param_search_url){
      back_btn.data('url', param_search_url);
    }

    rotateWindrose(plans_frame.find('.windrose'), -150);

    setTimeout(function(){
      frame.find('.plans__korpus-design').each(function(){
        $(this).addClass('active');
      });
    },2000);

    test_json('living', function() {
      svg_paper_bg = plans_frame.find('.plans_map_cont').area2svg({
        'opacity': 0,
        'fill': '#01a8b7',
        'fill-opacity': 1,
        'stroke-opacity': 0,
        'width' : 1920,
        'height' : 1080,
        click: function (el) {
          if (el.data('active')) {
            plans_current_values.b = Number(el.alt);
            korpus_reverse = false;
            change_stage({'stage' : 1});
          }
        },
        mouseover: function (el) {
          if(el.data('active')) frame.find('.plans__korpus-bubble[data-targ="' + el.alt + '"]').trigger('mouseenter').addClass('hover');
        },
        mouseout: function (el) {
          if(el.data('active')) frame.find('.plans__korpus-bubble[data-targ="' + el.alt + '"]').trigger('mouseleave').removeClass('hover');
        },
        each: function (el) {
          el.attr({'fill': '#01a8b7'});
        }
      });

      window.release_dates = JSON.parse(window.release_dates || "{}");
      frame.find('.plans__korpus-bubble').each(function() {
        var $bubble = $(this);
        var korp_num = $bubble.attr('data-targ');
        var release_date = window.release_dates[korp_num];
        $bubble.html(
          '<div class="label flats-count"></div>' +
          (release_date? '<div class="label release-date">' + release_date + '</div>' : '') +
          '<div class="plans__korpus-bubble-num"><span>' + get_korp_num(korp_num) + '</span></div>'
        );
      });


      load_quarter_minimap();

      var search_hash=frame.find('.search_hash').data('hash') || sessionStorage['search_hash'];
      var search_values={};

      var views = {};
      $.each(data.living.apartments, function(id, apart){
        if(apart.st == 1 && apart.views) views[apart.views] = true;
      });

      frame.find('.search_buttons_frame[data-targ="views"]').html(
        Object.keys(views).reduce(function(html, view){
          html += '<div class="search_buttons" data-targ="' + view + '"><span>' + view.capitalizeFirst() + '</span></div>';
          return html;
        }, '')
      );

      if(search_hash ) {
        var split_hash=search_hash.split('&');
        $.each(split_hash,function(index,value){
          var split_value=value.split('=');
          if(/active/.test(split_value[0])) {
            search_values[split_value[0]]=split_value[1];
          } else
          if(/-/.test(split_value[1])) {
            var split_value2=split_value[1].split('-');
            search_values[split_value[0]]={};
            search_values[split_value[0]].v_l=Number(split_value2[0]);
            search_values[split_value[0]].v_r=Number(split_value2[1]);
          } else {
            var split_value2 = split_value[1].split(',');
            search_values[split_value[0]]= split_value2.map(function(value){
              return isNaN(Number(value))? value : Number(value);
            });
          }
        })
      }

      param_search = frame2.searchInit({
        data: data.living.apartments,
        paramChange: function(val){
          encode_string = '';
          $.each(val, function(index, value){
            encode_string += index + '=';
            if(typeof value === 'string') {
              encode_string += value;
            } else
            if($.isPlainObject(value)) {
              encode_string += value.v_l + '-' + value.v_r;
            } else {
              encode_string += value.join();
            }
            encode_string += '&';
          });
          encode_string = encode_string.slice(0, -1);
          sessionStorage['search_hash'] = encode_string;
          pjax.loadPage((pjax.getPathname() + '').split('?')[0] + '?' + encode_string, {'suppress_load' : true});
          console.log(filter_design);
        },
        afterSearch: function(result) {
          if(stage === 0) filter_buildings(result);
          else if(stage === 1) filter_floors(result);
          else if(stage === 2) filter_aparts(result);
        },
        start_values: search_values,
        no_output: true,
        htmlNoLoad: true,
        pagination: 0
      });

      function reload_offers(building){
        var b = (building) ? building : '';
        $.ajax({
          url: '/ajax/load_offers_plans',
          cache: false,
          type: 'GET',
          data: {korp: b},
          success: function (response) {
            frame.find('.plans__offers-frame').html(response);
          }
        });
      }

      function change_stage(opt) {
        if(opt.delta) {
          stage += opt.delta;
        } else
        if(Number(opt.stage) === 0 || opt.stage) {
          stage = opt.stage;
        }
        if(stage != 3){
          frame.find('.similar_apartments_btn').removeClass('visible');
        }

        switch (stage) {
          case 0:
            change_stage_details();
            reload_offers();
            break;
          case 1:
            load_korpus({b : plans_current_values.b, type : 'plans', view : korpus_reverse? 'rev' : ''}, change_stage_details);
            reload_offers(plans_current_values.b);
            break;
          case 2:
            reload_offers(plans_current_values.b);
            load_floor(300, false, false, change_stage_details);
            break;
          case 3:
            load_floor_details();
            load_apart(300, false, change_stage_details);
          default:
            break;
        }

        if(!opt.no_history) change_url();
      }

      function change_stage_details() {
        param_search.forceSearch();

        plans_slider.transitionStop(true).transition({'x' : - (stage < 1 ? 0 : 1) * 100 + '%'}, 800, easyInOut);

        back_btn.toggleClass('hidden', stage === 0).find('.plans__back-label span').html(stages_names[stage - 1] ? stages_names[stage - 1] : '&nbsp;');
        bullets
          .filter('[data-targ="' + stage + '"]').attr('class', 'slideshow__bullet active')
          .prevAll('.slideshow__bullet').attr('class', 'slideshow__bullet').end()
          .nextAll('.slideshow__bullet').attr('class', 'slideshow__bullet inactive');

        frame.find('.plans__frame').attr('class', 'plans__frame ' + stages_classes[stage]);
      }

      function change_url() {
        var url = '/plans';

        switch (stage) {
          case 1:
            url += '/korpus' + plans_current_values.b;
            break;
          case 2:
            url += '/korpus' + plans_current_values.b + '/section' + plans_current_values.s + '/floor' + plans_current_values.f;
            break;
          case 3:
            url += '/korpus' + plans_current_values.b + '/section' + plans_current_values.s + '/floor' + plans_current_values.f + '/flat' + data.living.apartments[plans_current_values.n].n;
          default:
            break;
        }
        pjax.loadPage(url + (encode_string ? '?' + encode_string : ''), {'suppress_load' : true});
      }

      function filter_buildings(result) {
        var active_bs = {};

        for(var i = 0, l = result.length; i < l; i ++) {
          var d = data.living.apartments[result[i]];
          if(!active_bs[d.b]) active_bs[d.b] = 0;
          active_bs[d.b] ++;
        }
        console.log('active_bs',active_bs);
        frame.find('.plans__korpus-bubble').each(function() {
          var $bubble = $(this);
          var dt = $bubble.data('targ');
          var count = active_bs[dt] || 0;

          $bubble.toggleClass('active', !!count).find('.flats-count').text('Найдено: ' + count);
          svg_paper_bg.getByAlt(dt)[0].stop(true).animate(300).attr({'opacity' : count ? 0.33 : 0, 'cursor' : 'pointer'});
          svg_paper_bg.getByAlt(dt)[0].data('active', count? 1 : 0);
        });
      }

      function filter_floors(result) {
        var active_floors = {};

        for(var i = 0, l = result.length; i < l; i ++) {
          var d = data.living.apartments[result[i]];
          if(d.b === plans_current_values.b) {
            if(!active_floors[d.s + '-' + d.f]) active_floors[d.s + '-' + d.f] = 0;
            active_floors[d.s + '-' + d.f] ++;
          }
        }
        console.log('active_floors',active_floors);
        svg_paper_korp.forEach(function(el) {
          var alt = el.alt;

          if(active_floors[alt]) {
            el.stop(true).animate(300).attr({'cursor' : 'pointer', 'opacity' : 0.33});
            el.at = active_floors[alt];
          } else {
            el.stop(true).animate(300).attr({'cursor' : 'default', 'opacity' : 0});
            el.at = 0;
          }
        });
      }


      function filter_aparts(result) {
        var apart_help = [0, 0],
          apart_help_html = '',
          apart_help_text = ['Другие квартиры в продаже', 'Подходящие квартиры'];

        svg_paper_floor.forEach(function(el) {
          var alt = el.alt;

          if(($.inArray(alt, result) + 1) && el.st) {
            if(el.st > 1 || el.st == 0){
              el.bottom.attr({'opacity' : '0'});
            } else {
              el.bottom.attr({'opacity' : apart_opacity[1]});
            }
            el.data('active', 1);
            apart_help[1] += 1;
          } else
          if(el.st) {
            el.bottom.attr({'opacity' : apart_opacity[0]});
            el.data('active', 0);
            apart_help[0] += 1;
          }
        });
        for(var i = 1; i >= 0; i --) {
          if(apart_help[i]) apart_help_html += '<div class="apart__help"><div class="apart__help-icon" style="opacity: ' + apart_opacity[i] + ';"></div><span>' + apart_help_text[i] + '</span></div>';
        }
        frame.find('.apart__help-frame').html(apart_help_html);
      }

      function load_korpus(data, callback) {
        preloader.show();
        $.ajax({
          data : data,
          url: '/ajax/korpus_load',
          success: function(response) {
            korpus_frame
              .html(response)
              .find('.wait-load').on('load', function() {
              preloader.hide();
              page.resize();
              floor_rose_angle = korpus_frame.find('.plans__image-wrapper').data('floor-rose');
              rotateWindrose(korpus_frame.find('.windrose'), korpus_frame.find('.plans__image-wrapper').data('rose'));
              callback();
            });
            load_korpus_map();
          }
        });
      }

      function load_korpus_map() {
        var floor_popup = korpus_frame.find('.floor-popup'),
          svg_paper_korp_frame = korpus_frame.find('.plans__image');

        svg_paper_korp = korpus_frame.find('.plans_map_cont').area2svg({
          'opacity': 0,
          'fill': '#01a8b7',
          'fill-opacity': 1,
          'stroke-opacity': 0,
          'width' : 1920,
          'height' : 1080,
          click: function (el) {
            if (el.at) {
              var spl = el.alt.split('-');
              plans_current_values.s = Number(spl[0]);
              plans_current_values.f = Number(spl[1]);
              change_stage({'stage' : 2});
            }
          },
          mouseover: function (el) {
            if(el.at) {
              var spl = el.alt.split('-');
              el.stop(true).animate(200).attr({'opacity' : 0.6});
              var box = el.bbox();
              var scale = svg_paper_korp_frame.width() / svg_paper_korp.width;
              floor_popup.addClass('active').css(box.x2 * 100 / svg_paper_korp.width < 70 ? {'top' : el.getSideCenters().ry * scale, 'left' : box.x2 * scale, 'margin-left' : 0} : {'top' : el.getSideCenters().ly * scale, 'left' : box.x * scale, 'margin-left' : '-27em'})
                .find('>.n2').text(spl[1] > 9 ? spl[1] : '0' + spl[1]).end()
                .find('.plans__floor-label-at .n2').text(el.at);
            }
          },
          mouseout: function (el) {
            if(el.at) {
              el.stop(true).animate(200).attr({'opacity' : 0.33});
            }
            floor_popup.removeClass('active');
          },
          each: function (el) {
            var section_num = el.alt.split('-')[0];
            el.attr({'fill': (section_num % 2)? '#01a8b7' : '#c1d72e'});
          }
        });
      }

      function load_floor(time, no_history, directions, callback) {
        plans_current_values.n=null;
        // if (apart_zoom) {
        //     apart_zoom.setOff();
        // }
        load_floor_details();

        frame.find('.plan_frame.n0 .plan_frame_centrer_position').transitionStop(true).transition(get_floor_css(directions,0,1), time, function() {
          load_floor_map($(this), time, directions, callback);
        });

        // frame.find('.floor-popup').remove();
        // if (!no_history) {
        //     change_url('floor');
        // }
      }

      function load_floor_map(fr, time, directions, callback) {
        var floor_id = plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f,
          current_html = fr.data('targ'),
          d1 = $.Deferred();

        preloader.show();

        $.when(d1).done(function() {
          preloader.hide();
          // plans_current_values.apart_details.removeClass('active');
          fr.css(get_floor_css(directions,null,-1)).transition(get_floor_css(null,1,0), time);
          if(callback) callback();
        });

        if(floor_id == current_html) {
          d1.resolve();
        } else {
          fr.data('targ', floor_id).load('/hydra/floors/' + floor_id + '.html', function() {
            var apart_popups_html='';
            var aparts = [];
            var img=fr.find('.floor_map');
            var w=img.attr('width');
            var h=img.attr('height');
            img.on('load',function() {
              $(this).off('load');
              d1.resolve();
            });
            svg_paper_floor = fr.find('.floor_map_cont').area2svg({
              'opacity': 0,
              'width': w,
              'height': h,
              'cursor': 'default',
              click: function (el) {
                if (el.st == 1) {
                  plans_current_values.n = el.alt;
                  change_stage({'stage' : 3});
                }
              },
              mouseover: function (el) {
                if(!plans_current_values.n) {
                  if (el.st == 1) {
                    el.bottom.attr({'fill' : '#01a8b7'});
                    fr.find('.apart__bubble.n'+el.alt).addClass('hover');
                  }
                  load_apart_details(el.alt);
                }
              },
              mouseout: function (el) {
                if (el.st == 1) {
                  el.bottom.attr({'fill' : '#c1d72e'});
                  fr.find('.apart__bubble.n'+el.alt).removeClass('hover');
                }
                plans_current_values.apart_details.removeClass('active');
              },
              each: function (el) {
                var d = data.living.apartments[el.alt];
                if (!d || d.st != 1) {
                  if (!d) {
                    d = {};
                    d.st = 0;
                    console.log('null data at '+el.alt);
                  }
                  el.bottom.attr({'opacity': 0});
                } else {
                  el.bottom.attr({'opacity' : 0.2, 'fill' : '#c1d72e'});
                  el.attr({'cursor': 'pointer'});
                  var box = el.getCentroid();
                  apart_popups_html += '<div class="apart__bubble css_ani n' + el.alt + '" style="top:' + (100*box.cy/h) + '%; left:' + (100 * box.cx / w) + '%;"></div>';
                }
                el.st = d.st;
              }
            });
            fr.find('.floor_map').after(apart_popups_html);
            apart_popups_html=null;
          });
          load_floor_minimap();
        }
      }

      function load_quarter_minimap() {
        svg_paper_quarter_minimap = frame.find('.quarter_map_cont').area2svg({
          'opacity': 0,
          'fill': '#01a8b7',
          'width': 360,
          'height': 260,
          'cursor': 'default',
          click: function (el) {},
          mouseover: function (el) {},
          mouseout: function (el) {},
          each: function (el) {

          }
        });
      }

      function update_quarter_minimap() {
        svg_paper_quarter_minimap.forEach(function(el) {
          if(el.alt === plans_current_values.b + '-' + plans_current_values.s) el.attr({'opacity' : 1, 'fill' : '#01a8b7'});
          else el.attr({'opacity' : 0});
        });
      }

      function load_floor_minimap(callback) {
        callback = callback || function(){};
        var floor_id = plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f,
          fr = frame.find('.floor_minimap_frame');
        var current_html = fr.data('targ');

        if(current_html !== floor_id) {
          fr.data('targ', current_html).load('/hydra/floors/' + floor_id + '.html', function() {
            var img = fr.find('.floor_map');
            var w = img.attr('width');
            var h = img.attr('height');
            svg_paper_floor_minimap = fr.find('.floor_map_cont').area2svg({
              'opacity': 0,
              'fill': '#01a8b7',
              'width': w,
              'height': h,
              'cursor': 'default',
              click: function (el) {},
              mouseover: function (el) {},
              mouseout: function (el) {},
              each: function (el) {

              }
            });
            callback();
          });
        } else {
          callback();
        }
      }

      function load_floor_details() {
        rotateWindrose(floor_frame.find('.windrose'), floor_rose_angle, 300);

        if (!data.living.floors[plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f]) {
          plans_current_values.f = get_exist_floor(plans_current_values.f, -1);
        }
        if (data.living.floors[plans_current_values.b + '-' + plans_current_values.s + '-' + plans_current_values.f].at === 0) {
          plans_current_values.f = get_near_floor(plans_current_values.f);
        }
        // test_next_btn(plans_current_values.sect_sel.find('.sect_left'), get_closest_section(plans_current_values.s, -1));
        // test_next_btn(plans_current_values.sect_sel.find('.sect_right'), get_closest_section(plans_current_values.s, 1));
        test_next_btn(plans_current_values.floor_sel.find('.floor_down'), get_closest_floor(plans_current_values.f, -1));
        test_next_btn(plans_current_values.floor_sel.find('.floor_up'), get_closest_floor(plans_current_values.f, 1));
        //
        // plans_current_values.sect_sel.find('.val').text(plans_current_values.s);
        plans_current_values.floor_sel.find('.n2').text(plans_current_values.f > 9 ? plans_current_values.f : '0' + plans_current_values.f);

        update_quarter_minimap();
      }
      //var not_sale_text = ['Скоро в продаже', 'В продаже', 'Забронировано', 'Продано'];
      var not_sale_text = ['Продано', 'В продаже', 'Продано', 'Продано'];
      function load_apart_details(alt) {
        var d = data.living.apartments[alt];
        plans_current_values.apart_details.addClass('active');
        if (d && d.st==1) {
          plans_current_values.apart_details.removeClass('not-sale')
            .find('[data-targ="n"] .val').text(d.tn).end()
            .find('[data-targ="rc"] .val').text(d.rc).end()
            .find('[data-targ="sq"] .val').html(d.sq).end()
            .find('[data-targ="tc"] .val').text(Math.round(d.tc / 10000) / 100);


          plans_current_values.apart_details.find('.popup_details_row').removeClass('hidden');

          if(d.sc == d.tc){
            plans_current_values.apart_details.find('[data-targ="sc"]').addClass('hidden');
            plans_current_values.apart_details.find('[data-targ="sl"]').addClass('hidden');
          }

        } else {
          plans_current_values.apart_details.addClass('not-sale');
          plans_current_values.apart_details.find('.not_sale_text').text(not_sale_text[d.st]);
        }
      }

      function load_apart_img(img_frame, src, time, callback) {
        preloader.show();
        img_frame.transitionStop(true).transition({'opacity':0},time,function(){
          img_frame.html('<img class="apart_img" src="'+src+'" />')
            .find('.apart_img').css({'translate3d':0}).on('load',function() {
            preloader.hide();
            img_frame.transitionStop(true).transition({'opacity':1},time);
            $(this).off('load');
            if(callback) callback();
          });
        })
      }
      function load_apart(time, no_history, callback) {
        load_apart_details(plans_current_values.n);
        load_similiar_aparts(plans_current_values.n);
        var d = data.living.apartments[plans_current_values.n];
        if( d && d.fn==1){
          $('.apart_announce').show();
        } else {
          $('.apart_announce').hide();
        }
        load_apart_img(frame.find('.plan_frame.n1 .plan_frame_centrer_position'), '/hydra/apts/'+plans_current_values.n+'.png', time, callback);
        load_floor_minimap(function() {
          svg_paper_floor_minimap.forEach(function(el) {
            el.bottom.attr({'opacity' : (el.alt === plans_current_values.n) ? 0.8 : 0});
          });
        });
        frame.find('.plans_close').data('targ', param_search_url);
        if (!no_history) {
          change_url('flat');
        }
        frame.find('.apart_act_frame')
          .find('.fav_btn').toggleClass('active', checkFavourite(plans_current_values.n)).end()
          .find('.fav_link ').toggleClass('hidden', !checkFavourite(plans_current_values.n)).end()
          .find('.compare_btn').toggleClass('active', compare.check(plans_current_values.n)).end()
          .find('.compare_link').toggleClass('hidden', !compare.check(plans_current_values.n) || compare.list.length < 2);

        frame.find('.similar_apartments_btn').addClass('visible');

        if(d.lvl == 2){
          frame.find('.level_change').find('.img_level_tmb img').attr('src', '/hydra/apts/'+plans_current_values.n+'-l2.png');
          frame.find('.level_change').show();
        } else {
          frame.find('.level_change').hide();
        }
      }

      function load_similiar_aparts(apt_id){
        var apt = data.living.apartments[apt_id];
        var similiar_results = [];
        var similiar_param = {
          rc: apt.rc,
          sq_max: apt.sq + 10,
          sq_min: apt.sq - 10,
          floor_max: apt.f + 5,
          floor_min: apt.f - 5
        };
        $.each(data.living.apartments, function(index, value) {
          if(value.st == 1 && value.rc == similiar_param.rc){
            if(value.f <= similiar_param.floor_max && value.f >= similiar_param.floor_min){
              if(value.sq <= similiar_param.sq_max && value.sq >= similiar_param.sq_min){
                similiar_results.push(index);
              }
            }
          }
        });

        frame.find('.similar_apartments_btn .val').text(similiar_results.length + ' шт.')
        load_similiar_html(similiar_results);


      }

      function load_similiar_html(similiar_results){
        var similiar_html = '';
        var aparts = data.living.apartments;
        if(similiar_results && similiar_results.length!=0){
          $.each(similiar_results, function(index, value){
            var apt = aparts[value];
            similiar_html += '<div class="compare__cell" data-id="' + value + '">'+
              '<a class="compare__apart pjax" href="/plans/korpus'+apt.b+'/section'+apt.s+'/floor'+apt.f+'/flat'+apt.n+'">'+
              '<div class="compare__apart-header">'+
              '<div class="compare__apart-cell n0">'+
              '<div class="label">Корпус</div>'+
              '<div class="value">'+apt.b+'</div>'+
              '</div>'+
              '<div class="compare__apart-cell n1">'+
              '<div class="label">Секция</div>'+
              '<div class="value">' +apt.s+ '</div>'+
              '</div>'+
              '<div class="compare__apart-cell n2">'+
              '<div class="label">' + ((apt.t == 'Апартаменты')? 'Лофт' : 'Квартира') + '</div>'+
              '<div class="value">' + (apt.tn ? apt.tn : apt.n)  + '</div>' +
              '</div>'+
              '<div class="compare__apart-controls">'+
              '<div class="compare__apart-btn favorite' + (checkFavourite(value) ? ' active' : '') + '"></div>' +
              '</div>'+
              '</div>'+
              '<div class="compare__apart-preview" style="background-image: url(/hydra/apts/' +value+ '.png);"></div>'+
              '<div class="compare__apart-details">'+
              '<div class="compare__apart-row">'+
              '<div class="label">Этаж</div>'+
              '<div class="value">' +apt.f+ '</div>'+
              '</div>'+
              '<div class="compare__apart-row">'+
              '<div class="label">Площадь, м<sup>2</sup></div>'+
              '<div class="value">' + (Math.round(apt.sq * 100) / 100) + '</div>'+
              '</div>'+
              '<div class="compare__apart-row">'+
              '<div class="label">Стоимость, <br/>млн руб.</div>'+
              '<div class="value">' + ((apt.st > 0 && apt.tc) ? (Math.round(apt.tc / 10000) / 100) : '<span class="small">не в продаже</span>' ) + '</div>'+
              '</div>'+
              '<div class="compare__apart-row">'+
              '<div class="label">Вид</div>'+
              '<div class="value"><span class="small">' + ((apt.views) ? apt.views : 'нет данных')+ '</span></div>' +
              '</div>'+
              '</div>'+
              '</a>'+
              '</div>';
          });
          frame.find('.similar_apartments_frame .compare__list').html(similiar_html);
          if(similiar_scroll){
            similiar_scroll.reinitialise({fix_position: false});
          } else {
            similiar_init();
          }
        }
      }
      function similiar_init (){

        //if(similiar_scroll) similiar_scroll.removeEvents();

        $similiar_scroll.textScroll({
          horizontal: true,
          disable_scroll: false,
          disable_swipe: true,
          contentDrag: false,
          onScroll : function(pos){},
          onReinitialise : function(disabled){
            $similiar_controls.toggleClass('hidden', disabled);
          }
        });

        similiar_scroll = $similiar_scroll.data('plugin');
        frame
          .on('click', '.compare__apart-btn.favorite', function(e){
            var $btn = $(this);
            var id = $btn.parents('.compare__cell').attr('data-id');
            if($btn.hasClass('active')) {
              $btn.removeClass('active');
              removeFavourite(id);
            } else {
              $btn.addClass('active');
              addFavourite(id);
            }
            e.preventDefault();
            e.stopPropagation();
          })
          .on('click', '.compare__apart', function(){
            param_search_url = pjax.getPathname();
          })
          .on('click', '.compare__scroll-arrow', function(){
            var $btn = $(this);
            var delta = $btn.data('targ');
            var position = similiar_scroll.getScrollPosition();
            similiar_scroll.scrollTo(position + delta * (32.5 / ($similiar_scroll.width() / font_size * (similiar_scroll.getMaxScrollPosition() - 1)) * 100));
          });
      }

      function get_floor_css(directions,opacity,direction) {
        var css = {};
        if(directions) {
          css = get_transition_css(direction*10*directions[0]+'%',direction*10*directions[1]+'%');
        } else
        if(direction == 0) {
          css = get_transition_css('0%','0%');
        }
        if(opacity !== null) {
          css.opacity = opacity;
        }
        return css;
      }

      function test_next_btn(btn,val) {
        if (val==null) {
          btn.removeClass('active');
        } else {
          btn.addClass('active').data('targ',val).find('span').text(val < 10 ? '0' + val : val);
        }
      }
      function get_exist_floor(floor,delta) {
        floor+=delta;
        if (data.living.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor]) {
          return floor;
        } else {
          return get_exist_floor(floor,delta);
        }
      }
      function get_closest_floor(floor,delta,i) {
        floor += delta;
        if(i == undefined) {
          i=0;
        } else {
          i++;
        }
        if (i>20) {
          return null;
        } else
        if (data.living.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor] && data.living.floors[plans_current_values.b+'-'+plans_current_values.s+'-'+floor].at!=0) {
          return floor;
        } else {
          return get_closest_floor(floor,delta,i)
        }
      }
      function get_near_floor(floor) {
        var floor_down=get_closest_floor(floor, -1);
        var floor_up=get_closest_floor(floor, 1);
        var result=null;
        if((floor_up && !floor_down) || (floor_up && floor_down && floor_up-floor<floor-floor_down)) {
          result=floor_up;
        } else
        if(floor_down) {
          result=floor_down;
        }
        return result;
      }
      function get_closest_section(section,delta,i) {
        section+=delta;
        if(i==undefined) {
          i=0;
        } else {
          i++;
        }
        if (i>20) {
          return null;
        } else
        if (data.living.sections[plans_current_values.b+'-'+section] && data.living.sections[plans_current_values.b+'-'+section].at!=0) {
          return section;
        } else {
          return get_closest_section(section,delta,i)
        }
      }
      function load_floor_animation(options) {
        var direction_floor=0;
        var direction_section=0;
        if(options.floor!=undefined) {
          var floor_next=Number(options.floor);
          if(floor_next<plans_current_values.f) {
            direction_floor=-1
          } else {
            direction_floor=1;
          }
          plans_current_values.f=floor_next;
        }
        if(options.section!=undefined) {
          var section_next=Number(options.section);
          if(section_next>plans_current_values.s) {
            direction_section=-1
          } else {
            direction_section=1;
          }
          plans_current_values.s=section_next;
        }
        load_floor(300,null,[direction_floor,direction_section], param_search.forceSearch);
        change_url();
      }


      if(plans_info.data('stage')) {
        change_stage({'stage' : plans_info.data('stage'), 'no_history' : true});
      }

      if(filter_design == true){
        $('.search_reset_btn').trigger('click');
        var targ = frame.find('.search_buttons_frame[data-targ="fn"]').parent().siblings('.search_buttons_title');
        targ.addClass('active')
          .siblings('.search_buttons_hidden').transitionToggleHeight(targ.hasClass('active'), 500, function() {
          frame.find('.plans__filters').data('plugin').reinitialise({fix_position:true});
        });
        $('.search_buttons_frame[data-targ="fn"] .search_buttons[data-targ="1"]').trigger('click');
        filter_design = false;
      }

      frame
        .on('click', '.search_buttons_title', function() {
          var that = $(this);

          that
            .toggleClass('active')
            .siblings('.search_buttons_hidden').transitionToggleHeight(that.hasClass('active'), 500, function() {
            frame.find('.plans__filters').data('plugin').reinitialise({fix_position:true});
          });
        })
        .on('click', '.plans__korpus-bubble', function() {
          if($(this).hasClass('active')) {
            plans_current_values.b = Number($(this).data('targ'));
            change_stage({'stage' : 1});
          }
        })
        .on('mouseenter', '.plans__korpus-bubble', function() {
          if($(this).hasClass('active')) {
            svg_paper_bg.getByAlt($(this).data('targ'))[0].stop(true).animate(100).attr({'fill' : '#ffffff'});
          }
        })
        .on('mouseleave', '.plans__korpus-bubble', function() {
          if($(this).hasClass('active')) {
            svg_paper_bg.getByAlt($(this).data('targ'))[0].stop(true).animate(100).attr({'fill' : '#01a8b7'});
          }
        })
        .on('click', '.plans__back', function(){
          var url = $(this).data('url');
          if(url){
            pjax.loadPage(url);
          } else {
            change_stage({'delta' : -1});
          }
        })
        .on('click', '.slideshow__bullet', function() {
          if(!$(this).hasClass('active') && !$(this).hasClass('inactive')) {
            change_stage({'stage' : $(this).data('targ')});
          }
        })
        .on('click', '.floor_down.active, .floor_up.active', function() {
          load_floor_animation({
            floor:$(this).data('targ')
          });
        })
        .on('click', '.pdf_btn', function() {
          window.open('/assets/php/pdf.php?id='+plans_current_values.n, '_blank');
        })
        .on('click', '.fav_btn', function(){
          var $btn = $(this);
          if($btn.hasClass('active')) {
            $btn.removeClass('active');
            removeFavourite(plans_current_values.n);
            $btn.next('.fav_link').addClass('hidden');
          } else {
            $btn.addClass('active');
            addFavourite(plans_current_values.n);
            $btn.next('.fav_link').removeClass('hidden');
          }
        })
        .on('click', '.compare_btn', function(){
          var $btn = $(this);
          if($btn.hasClass('active')) {
            $btn.removeClass('active');
            compare.remove(plans_current_values.n);
            $btn.next('.compare_link').addClass('hidden');
          } else {
            $btn.addClass('active');
            compare.add(plans_current_values.n);
            if(compare.list.length > 1)  $btn.next('.compare_link').removeClass('hidden');
          }
        })
        .on('click', '.compare_link', function(){
          pjax.loadPage('/plans/compare');
        })
        .on('click', '.plans__release-btn', function(){
          var active = $(this).hasClass('active');
          $(this).toggleClass('active').find('.label').text(active? 'Показать сроки готовности' : 'Скрыть сроки готовности');
          frame.find('.plans__korpus-bubble').toggleClass('with-release');
        })
        .on('click', '.plans__rotate-button', function(){
          korpus_reverse = !korpus_reverse;
          korpus_frame.transitionStop().transition({'opacity' : '0'}, 500, function(){
            load_korpus({
              b : plans_current_values.b,
              type : 'plans',
              view : korpus_reverse? 'rev' : ''
            }, function(){
              korpus_frame.transitionStop().transition({'opacity' : '1'}, 500);
              change_stage_details();
            });
          });
        })
        .on('click', '.level_change', function(){
          if($(this).hasClass('active')){
            $(this).find('.img_level_tmb img').attr('src', '/hydra/apts/'+plans_current_values.n+'-l2.png');
            $(this).find('span').text('Планировка второго этажа');
            load_apart_img(frame.find('.plan_frame.n1 .plan_frame_centrer_position'), '/hydra/apts/'+plans_current_values.n+'.png', 200);
          } else {
            $(this).find('.img_level_tmb img').attr('src', '/hydra/apts/'+plans_current_values.n+'.png');
            $(this).find('span').text('Планировка первого этажа');
            load_apart_img(frame.find('.plan_frame.n1 .plan_frame_centrer_position'), '/hydra/apts/'+plans_current_values.n+'-l2.png', 200);
          }
          $(this).toggleClass('active');
        });

    });

    function plan_check_size() {
      frame.find('.plan_frame_centrer').each(function(){
        var fr = $(this);
        var fr2 = fr.parent();
        var apart_ratio = $(this).data('targ')||1;
        var fr2_w=fr2.width();
        var fr2_h=fr2.height();
        var plan_size = Math.min(fr2_w / apart_ratio, fr2_h);
        fr.css({'width': plan_size * apart_ratio, 'height': plan_size, 'margin-top': 0.5 * (fr2_h-plan_size), 'margin-left':0.5 * (fr2_w-plan_size * apart_ratio)});
      })
    }

    frame
      .on('click', '.plans__offers-button', function() {
        $(this).parents('.plans__offers-frame').addClass('opened');
      })
      .on('click', '.plans__offers-close', function() {
        $(this).parents('.plans__offers-frame').removeClass('opened');
      })
      .on('click', '.similar_apartments_btn', function() {
        frame.find('.similar_apartments_frame').addClass('active');
      })
      .on('click', '.similiar_close', function() {
        frame.find('.similar_apartments_frame').removeClass('active');
      });

  }())}
  if(targ=="search") {(function(){
    page.unset=function(){
      frame.off();
      unloadPlugin(param_search);
    };

    var param_search;
    test_json('living', function() {
      var search_hash=frame.find('.search_hash').data('hash')/* || sessionStorage['search_hash']*/;
      var search_values={};

      var views = {};
      $.each(data.living.apartments, function(id, apart){
        if(apart.st == 1 && apart.views) views[apart.views] = true;
      });

      frame.find('.search_buttons_frame[data-targ="views"]').html(
        Object.keys(views).reduce(function(html, view){
          html += '<div class="search_buttons" data-targ="' + view + '"><span>' + view.capitalizeFirst() + '</span></div>';
          return html;
        }, '')
      );

      if(search_hash ) {
        var split_hash=search_hash.split('&');
        $.each(split_hash,function(index,value){
          var split_value=value.split('=');
          if(/active/.test(split_value[0])) {
            search_values[split_value[0]]=split_value[1];
          } else
          if(/-/.test(split_value[1])) {
            var split_value2=split_value[1].split('-');
            search_values[split_value[0]]={};
            search_values[split_value[0]].v_l=Number(split_value2[0]);
            search_values[split_value[0]].v_r=Number(split_value2[1]);
          } else {
            var split_value2 = split_value[1].split(',');
            search_values[split_value[0]]= split_value2.map(function(value){
              return isNaN(Number(value))? value : Number(value);
            });
          }
        })
      }
      param_search = frame2.searchInit({
        data: data.living.apartments,
        preview: true,
        resultClick: function (id) {
          param_search_url = pjax.getPathname();
          var d = data.living.apartments[id];
          pjax.loadPage('/plans/korpus' + d.b + '/section' + d.s + '/floor' + d.f + '/flat' + d.n);
          //window.open('/assets/php/pdf.php?id='+id,'_blank');
        },
        paramChange: function(val){
          var encode_string='';
          $.each(val,function(index,value){
            encode_string+=index+'=';
            if(typeof value=='string') {
              encode_string+=value;
            } else
            if($.isPlainObject(value)) {
              encode_string+=value.v_l+'-'+value.v_r;
            } else {
              encode_string+=value.join();
            }
            encode_string+='&';
          });
          encode_string=encode_string.slice(0,-1);
          sessionStorage['search_hash'] = encode_string;
          pjax.loadPage('/plans/search?'+encode_string, {'suppress_load': true});
        },
        rules: {
          'b' : function(value){
            return get_korp_num(value);
          },
          's' : function(value){
            return (value || 1);
          },
          'tn' : function(value){
            return ('№' + value);
          },
          'sq' : function(value){
            return (value + '').replace('.', ',');
          },
          'finishingtype' : function(value){
            if(value == '1'){
              return 'чистовая';
            } else if (value == '2'){
              return 'предчистовая';
            }else {
              return 'без отделки';
            }
          },
          'rc' : function(value){
            return (value || 'СТ');
          },
          'views' : function(value){
            return (value || '&nbsp;');
          },
          'fav' : function(value, id){
            return '<span class="search__favorite-btn' + (checkFavourite(id)? ' active' : '') + '"></span>';
          },
          'sc' : function(value, id){
            var d = data.living.apartments[id];
            return ( (value == d.tc) ? '-' : addspace(value));
          },
          'sl' : function(value){
            return ( (value == 0) ? '-' : addspace(value));
          }
        },
        start_values: search_values,
        htmlNoLoad: true,
        pagination: 0
      });
    });

    frame
      .on('click', '.search_buttons_title', function() {
        var that = $(this);

        that
          .toggleClass('active')
          .siblings('.search_buttons_hidden').transitionToggleHeight(that.hasClass('active'), 500, function() {
          frame.find('.plans__filters').data('plugin').reinitialise({fix_position:true});
        });
      })
      .on('click', '.plans__offers-button', function() {
        $(this).parents('.plans__offers-frame').addClass('opened');
      })
      .on('click', '.plans__offers-close', function() {
        $(this).parents('.plans__offers-frame').removeClass('opened');
      });

    frame2.on('click', '.search__favorite-btn', function(e){
      var $btn = $(this),
        id = $(this).parents('tr').data('targ');
      if($btn.hasClass('active')) removeFavourite(id);
      else addFavourite(id);
      $btn.toggleClass('active');
      e.stopPropagation();
    });
  }())}
  if(targ=="vtour") {(function(){
    page.unset = function(){
      frame.off();
    };

    page.resize = function(){
      plan_check_size();
    };

    function plan_check_size() {
      frame.find('.vtour__image-size').each(function(){
        var fr = $(this);
        var fr2 = fr.parent();
        var apart_ratio = $(this).data('targ') || 1920 / 1080;
        var fr2_w=fr2.width();
        var fr2_h=fr2.height();
        var plan_size = Math.max(fr2_w / apart_ratio, fr2_h);
        fr.css({
          'width': plan_size * apart_ratio,
          'height': plan_size,
          'margin-top': 0.5 * (fr2_h-plan_size),
          'margin-left':0.5 * (fr2_w-plan_size * apart_ratio)
        });
      })
    }

    if(pages_info.previous.url == '/commercial'){
      frame.find('.plans__back').show();
    }
    rotateWindrose(frame.find('.windrose'), -110);

    var pano_info = {
      '10' : [0, {}, [56.59, 42.46]],
      '11' : [0, {}, [59.39, 50.61]],
      '12' : [0, {}, [63.85, 47.55]],
      '00' : [0, {}, [34.86, 52.43]],
      '01' : [0, {}, [31.79, 58.97]],
      '02' : [0, {}, [35.09, 60.23]],
      '03' : [0, {}, [37.91, 55.66]],
      '04' : [0, {}, [39.45, 61.17]],
      '05' : [0, {}, [42.52, 53.05]],
      '06' : [0, {}, [45.35, 62.08]],
      '07' : [0, {}, [54.56, 56.94]],
      '08' : [0, {}, [56.40, 49.59]],
      '09' : [0, {}, [50.35, 40.89]]
    };

    var $pano_content_frame = frame.find('.pano_content_frame');

    function set_pano_info(targ) {
      current_pano=targ;
      //frame.find('.pano_open_btn[data-targ="'+targ+'"]').setActive();
      pano_open_btn_view=frame.find('.pano_open_btn.active .pano_open_btn_view');
      //$.cookie('pano',targ,{expires: 1, path: '/'});
      $.each(pano_info[targ][1],function(i,v){
        //console.log(coords);
        krpano.call('addhotspot(hotspot_'+i+')');
        krpano.call('set(hotspot[hotspot_'+i+'].url, /assets/i/sprite.png)');
        krpano.call('set(hotspot[hotspot_'+i+'].ath, '+v[0]+')');
        krpano.call('set(hotspot[hotspot_'+i+'].atv, '+v[1]+')');
        krpano.call('set(hotspot[hotspot_'+i+'].onclick, js(load_pano('+i+')))');

        krpano.call('set(hotspot[hotspot_'+i+'].crop, 267|5|55|59)');
        krpano.call('set(hotspot[hotspot_'+i+'].onovercrop, 329|5|55|59)');
        krpano.call('set(hotspot[hotspot_'+i+'].edge, bottom)');
        //console.log('add hotspot '+i);
      });
      frame.find('.pano_map_open_image_frame').css({'left':-(0.01*192*pano_info[targ][2][0])+'em','top':-(0.01*108*pano_info[targ][2][1])+'em'});
    }

    function togglePano(show){
      $('.menu__button').toggleClass('white', show);
      frame.toggleClass('pano_opened', show);
      $pano_content_frame.toggleClass('visible', show);
    }

    load_pano = function (targ, keepview) {
      //console.log(targ,krpano)
      if(!krpano) {
        current_pano=targ;
        preloader.show();
        //frame.find('.pano_content_frame').transitionStop(true).css({'opacity': 0, 'display': 'block'});
        frame.find('.pano_place').addClass('off').html('<div class="pano_screen div_100" id="pano_'+targ+'"><script>embedpano({swf:"/assets/pages/pano/pano.swf",xml:"/assets/pages/pano/'+targ+'.xml",target:"pano_'+targ+'",id:"pano_'+targ+'_swf",wmode:"opaque","bgcolor":"#000000",html5:"prefer",onready:krpanoReady});</script></div>');
      } else {
        if(pano_info && pano_info[current_pano] && pano_info[current_pano][1] && pano_info[current_pano][1][targ]) {
          var start_deg='null';
          if(pano_info[targ] && pano_info[targ][1] && pano_info[targ][1][current_pano]) {
            start_deg='view.hlookat='+(pano_info[targ][1][current_pano][0]+180);
          }
          var targ_view=pano_info[current_pano][1][targ];
          krpano.call('lookto('+targ_view[0]+','+targ_view[1]+',null,tween(easeInOutExpo,0.5),true,false,null);');
          setTimeout(function(){
            krpano.call('loadpano("/assets/pages/pano/'+targ+'.xml",'+start_deg+',null,OPENBLEND(1, -0.5, 0.3, 5, linear));');
            set_pano_info(targ);
          },600)
        } else {
          krpano.call('loadpano("/assets/pages/pano/'+targ+'.xml",null,'+(keepview||'null')+',BLEND(1));');
          set_pano_info(targ);
        }
        togglePano(true);
      }
    };

    function unload_pano() {
      preloader.hide();
      krpano=null;
      togglePano(false);
      //hide_element(frame.find('.pano_content_frame'));
    }

    pano_loaded = function() {
      preloader.hide();
      togglePano(true);
      //show_element(frame.find('.pano_content_frame'));
      frame.find('.pano_place').removeClass('off');
    };

    pano_rotated=function() {
      var deg=krpano.get('view.hlookat');
      //console.log(deg + ' / ' + krpano.get('view.vlookat'));
      deg=-deg+pano_info[current_pano][0];

      rotateWindrose(windrose,deg,0);
      pano_open_btn_view.css({'rotate':-deg-25+'deg'});
    };

    krpanoReady=function(pano) {
      krpano=pano;
      krpano.set('events.onloadcomplete','js(pano_loaded())');
      krpano.set('events.onviewchange','js(pano_rotated())');
      set_pano_info(current_pano);
    };

    var krpano, current_pano, pano_open_btn_view;
    var windrose=frame.find('.windrose.n1');
    rotateWindrose(frame.find('.windrose.n0'),-25,0);

    var pano_open_btns_html='';
    $.each(pano_info,function(i,v){
      pano_open_btns_html+='<div class="pano_open_btn" data-targ="'+i+'" style="left:'+v[2][0]+'%; top:'+v[2][1]+'%;"><div class="pano_open_btn_icon"></div></div>';
    });

    frame.find('.pano_points_frame').append(pano_open_btns_html);
    pano_open_btns_html=null;

// frame.find('.pano_points_frame').dragChildrens();
//frame.find('.pano_points_frame .pano_open_btn').sortY();


    plan_check_size();

    frame
      .on('click', '.pano_open_btn', function(event){
        //$pano_content_frame.css({'transform-origin': parseInt(event.pageX / frame_w * 100)  + '% ' + parseInt(event.pageY / frame_h * 100)  + '%'});
        if(!$(this).hasClass('visible')) {
          load_pano($(this).data('targ'));
        } else {
          togglePano(true);
        }
      })
      .on('click', '.pano_close', function() {
        unload_pano();
      });
  }())}
  return page;
}
console.clear = function(){}