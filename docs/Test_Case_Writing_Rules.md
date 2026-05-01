# Правила написання тест-кейсів

Цей файл описує правила для ручних тест-кейсів у проєкті Redmine.org. Автотести мають зберігати зв'язок із цими тест-кейсами через `TC-XX` у назві тесту та матрицю покриття в `TEST_PLAN.md`.

## Що має містити тест-кейс

1. **ID тест-кейсу**: формат `TC-01`, `TC-02`, `TC-03`. ID має збігатися з відповідним автотестом.
2. **Назва**: коротко описує дію та очікуваний результат, наприклад `Verify Register form validation for empty required fields`.
3. **Priority / Severity**: smoke-сценарії зазвичай мають `High`, ширші regression-перевірки можуть мати `Medium`.
4. **Type / Tag**: для автотестів використовується рівно один основний тег: `@smoke` або `@regression`.
5. **Preconditions**: стан системи перед тестом, наприклад `The user is not logged in. The Register page is available.`
6. **Test Data**: очевидно фейкові дані без реальних email, паролів, телефонів або персональних даних.
7. **Steps**: короткі послідовні дії користувача.
8. **Expected Result**: конкретний перевірний результат для важливих кроків.
9. **Automation Notes**: Page Object, spec-файл, Allure labels або важливі технічні обмеження.

## Чого не має бути

- Нечітких цілей на кшталт `Check page` або `Verify Redmine`.
- Реальних production-змін: створення акаунтів, issues, forum messages, wiki edits.
- Нестабільних перевірок динамічних даних, наприклад точного номера останнього issue.
- Expected result без можливості перевірки, наприклад `Everything works correctly`.
- CSS selectors або Playwright locators у ручному тест-кейсі.

## Правила для Playwright і Allure

- Назва автотесту має містити ID ручного кейсу: `TC-01: Verify Redmine home page overview content @smoke`.
- У spec-файлах не має бути raw selectors без потреби; селектори й дії належать Page Object або Component Object.
- Кожен тест має мати хоча б одну явну assertion.
- Hard waits не використовуються; замість них застосовуються Playwright web-first assertions.
- Для Allure додаються логічні labels: `epic`, `feature`, `story`, `tag`.
- Для динамічного контенту Redmine.org перевіряються стабільні речі: heading, URL path, таблиці, controls, validation state.

## Чому деякі автотести ширші

У цьому завданні потрібно рівно п'ять автотестів. Тому окремі тест-кейси можуть містити кілька споріднених перевірок у межах одного user flow. Такі підсценарії мають бути оформлені через Playwright `test.step()`, щоб Allure-звіт залишався читабельним.

## Джерела

- [QATestLab test case example](https://qatestlab.com/assets/Uploads/QATestLab-Test-cases-Project-Name-example.pdf)
- [QATestLab: тест-дизайн і тест-кейси](https://training.qatestlab.com/blog/course-materials/lecture-test-case/)
- [QATestLab: типові помилки при описі тест-кейсів](https://training.qatestlab.com/blog/course-materials/typical-mistakes-when-describing-test-cases-on-the-course/)
