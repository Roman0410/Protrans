$('.copyright-year').text(new Date().getFullYear());

$('.burger-menu').click(function () {
  $(this).toggleClass('active');
  $('.header-links').toggleClass('active');
  $('body').toggleClass('lock');
  $('header').toggleClass('open');
});

$('.mobile-nav .nav-link, .mobile-nav .btn').click(function () {
  $('.burger-menu').removeClass('active');
  $('.header-links').toggleClass('active');
  $('body').removeClass('lock');
});
$('.mobile-btn').click(function () {
  $('.burger-menu').removeClass('active');
  $('.header-links').toggleClass('active');
  $('body').removeClass('lock');
});
$(window).on('load', function () {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      offset: 100,
      delay: 0,
      anchorPlacement: 'top-bottom',
    });
  } else {
    $('body').addClass('aos-not-loaded');
  }
});

// Header scroll handler - працює на всіх сторінках
function handleHeaderScroll() {
  const $header = $('.header');

  if ($header.length) {
    function handleScroll() {
      const scrollPosition = $(window).scrollTop();

      if (scrollPosition > 150) {
        $header.addClass('scrolled');
      } else {
        $header.removeClass('scrolled');
      }
    }

    handleScroll();
    $(window).on('scroll', handleScroll);
  }
}

$(document).ready(function () {
  handleHeaderScroll();

  // Language selector
  const $languageSelector = $('.language-selector:not(.mobile)');
  const $mobileLanguageSelector = $('.language-selector.mobile');
  const $languageBtn = $('.language-btn');

  if ($languageSelector.length) {
    // Toggle desktop language dropdown
    $languageSelector.find('.language-btn').on('click', function (e) {
      e.stopPropagation();
      $languageSelector.toggleClass('active');
    });
  }

  if ($mobileLanguageSelector.length) {
    // Toggle mobile language dropdown
    $mobileLanguageSelector.find('.language-btn').on('click', function (e) {
      e.stopPropagation();
      $mobileLanguageSelector.toggleClass('active');
    });
  }

  // Close dropdown when clicking outside
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.language-selector').length) {
      $('.language-selector').removeClass('active');
    }
  });

  // Update current language text when selecting a language
  $('.language-link').on('click', function () {
    const lang = $(this).text();
    $('.current-lang').text(lang);
  });

  // Processes toggler
  const $processSteps = $('.process-step');
  const $processCards = $('.process-card');

  if ($processSteps.length && $processCards.length) {
    $processSteps.on('click', function () {
      const target = $(this).data('process');

      $processSteps.removeClass('active');
      $(this).addClass('active');

      $processCards.removeClass('active');
      $processCards
        .filter(`[data-process-content="${target}"]`)
        .addClass('active');
    });
  }

  const $certificatesSlider = $('.certificates-slider');

  if ($certificatesSlider.length) {
    $certificatesSlider.slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 50,
      arrows: false,
      infinite: true,
      speed: 6000,
      cssEase: 'linear',
      pauseOnHover: false,
      pauseOnFocus: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  // Phone mask
  const phoneInput = document.getElementById('tel');
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');

      // Якщо починається з 0, замінюємо на +380
      if (value.startsWith('0')) {
        value = '380' + value.substring(1);
      }

      // Обмежуємо до 12 цифр (380 + 9 цифр)
      if (value.length > 12) {
        value = value.substring(0, 12);
      }

      // Форматуємо: +380 (xx) xxx-xx-xx
      let formatted = '';
      if (value.length > 0) {
        formatted = '+380';
        if (value.length > 3) {
          formatted += ' (' + value.substring(3, 5);
          if (value.length > 5) {
            formatted += ') ' + value.substring(5, 8);
            if (value.length > 8) {
              formatted += '-' + value.substring(8, 10);
              if (value.length > 10) {
                formatted += '-' + value.substring(10, 12);
              }
            }
          }
        }
      }

      e.target.value = formatted;
    });
  }

  // Form validation and email sending
  const contactForm = document.getElementById('main-form');

  if (contactForm) {
    // Initialize JustValidate
    const validation = new JustValidate('#main-form', {
      errorFieldCssClass: 'just-validate-error-field',
      errorLabelCssClass: 'just-validate-error-label',
      successFieldCssClass: 'just-validate-success-field',
    });

    validation
      .addField('#name', [
        {
          rule: 'required',
          errorMessage: "Ім'я обов'язкове для заповнення",
        },
        {
          rule: 'minLength',
          value: 2,
          errorMessage: "Ім'я має містити мінімум 2 символи",
        },
      ])
      .addField('#tel', [
        {
          rule: 'required',
          errorMessage: "Телефон обов'язковий для заповнення",
        },
        {
          rule: 'customRegexp',
          value: /^(\+380|380|0)?\s?\(?\d{2}\)?\s?\d{3}[- ]?\d{2}[- ]?\d{2}$/,
          errorMessage: 'Введіть коректний номер телефону',
        },
      ])
      .addField('#email', [
        {
          rule: 'required',
          errorMessage: "Електронна пошта обов'язкова для заповнення",
        },
        {
          rule: 'email',
          errorMessage: 'Введіть коректну електронну пошту',
        },
      ])
      .onSuccess((event) => {
        event.preventDefault();

        // Показуємо індикатор завантаження
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Відправка...';
        submitButton.disabled = true;

        // Отримуємо дані форми
        const formData = new FormData(contactForm);
        const formAction = contactForm.getAttribute('action');

        // Відправка через FormSubmit (AJAX)
        fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        })
          .then((response) => {
            if (response.ok) {
              // Успішна відправка
              submitButton.textContent = 'Відправлено!';
              submitButton.style.backgroundColor = '#4caf50';
              contactForm.reset();
              validation.refresh();

              // Показуємо повідомлення про успіх
              alert('Дякуємо! Ваше повідомлення успішно відправлено.');

              // Повертаємо кнопку в початковий стан через 3 секунди
              setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.backgroundColor = '';
              }, 3000);
            } else {
              throw new Error('Помилка відправки');
            }
          })
          .catch((error) => {
            // Помилка відправки
            console.error('Помилка відправки:', error);
            submitButton.textContent = 'Помилка відправки';
            submitButton.style.backgroundColor = '#f44336';

            alert(
              'Вибачте, сталася помилка при відправці повідомлення. Спробуйте ще раз або зателефонуйте нам.'
            );

            // Повертаємо кнопку в початковий стан через 3 секунди
            setTimeout(() => {
              submitButton.textContent = originalText;
              submitButton.disabled = false;
              submitButton.style.backgroundColor = '';
            }, 3000);
          });
      });
  }
});
