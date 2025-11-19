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

  // Phone input with intl-tel-input
  const phoneInput = document.getElementById('tel');
  let iti;
  if (phoneInput && window.intlTelInput) {
    // Ініціалізуємо intl-tel-input
    iti = window.intlTelInput(phoneInput, {
      initialCountry: 'auto', // Автоматичне визначення країни за IP
      preferredCountries: ['ua', 'pl', 'gb', 'us'], // Пріоритетні країни (ua, pl, en)
      autoPlaceholder: 'aggressive', // Автоматичний placeholder
      formatOnDisplay: true, // Форматування при введенні
      separateDialCode: false, // Не відокремлювати код країни
      utilsScript:
        'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/20.1.0/js/utils.js', // Для валідації та форматування
    });

    // Якщо автоматичне визначення не спрацювало, встановлюємо UA за замовчуванням
    setTimeout(() => {
      if (!iti.getSelectedCountryData().iso2) {
        iti.setCountry('ua');
      }
    }, 1000);
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
          rule: 'custom',
          validator: function () {
            if (!iti || !phoneInput) return false;
            // Перевіряємо, чи введено хоча б одну цифру
            const value = phoneInput.value.replace(/\D/g, '');
            if (value.length < 4) return false;
            // Використовуємо валідацію intl-tel-input
            return iti.isValidNumber();
          },
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

        // Якщо використовується intl-tel-input, отримуємо номер в міжнародному форматі
        if (iti && phoneInput) {
          const phoneNumber = iti.getNumber();
          formData.set('phone', phoneNumber); // Замінюємо номер на міжнародний формат
        }

        const formAction = contactForm.getAttribute('action');

        // Відправка через FormSubmit (AJAX)
        fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        })
          .then(async (response) => {
            // FormSubmit повертає 200 OK при успішній відправці
            if (response.ok) {
              try {
                const data = await response.json();
                // Перевіряємо, чи є помилка в відповіді
                if (data.error) {
                  throw new Error(data.message || 'Помилка відправки');
                }
              } catch (e) {
                // Якщо не JSON або інша помилка, але response.ok = true, значить відправка успішна
                if (e.name !== 'SyntaxError') {
                  throw e;
                }
              }

              // Успішна відправка
              submitButton.textContent = 'Відправлено!';
              submitButton.style.backgroundColor = '#4caf50';
              contactForm.reset();
              validation.refresh();

              // Показуємо повідомлення про успіх
              alert(
                "Дякуємо! Ваше повідомлення успішно відправлено. Ми зв'яжемося з вами найближчим часом."
              );

              // Повертаємо кнопку в початковий стан через 3 секунди
              setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.backgroundColor = '';
              }, 3000);
            } else {
              // Якщо response не ok, намагаємося отримати деталі помилки
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || 'Помилка відправки');
            }
          })
          .catch((error) => {
            // Помилка відправки
            console.error('Помилка відправки:', error);
            submitButton.textContent = 'Помилка відправки';
            submitButton.style.backgroundColor = '#f44336';

            alert(
              'Вибачте, сталася помилка при відправці повідомлення. Спробуйте ще раз або зателефонуйте нам за номером +380 (73) 333 75 56.'
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
