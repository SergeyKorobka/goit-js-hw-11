import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  dateTimePicker: document.querySelector('#datetime-picker'),
  outputDays: document.querySelector('[data-days]'),
  outputHours: document.querySelector('[data-hours]'),
  outputMinutes: document.querySelector('[data-minutes]'),
  outputSeconds: document.querySelector('[data-seconds]'),
};

iziToast.settings({
  timeout: 3000,
  pauseOnHover: true,
  position: 'topRight',
});

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose,
};

let userSelectedDate = null;

flatpickr(refs.dateTimePicker, options);

refs.startBtn.addEventListener('click', onStartBtn);

function onStartBtn() {
  refs.startBtn.disabled = true;

  if (!validateSelectedDate(userSelectedDate)) {
    return;
  }

  refs.dateTimePicker.disabled = true;

  const intervalId = setInterval(() => {
    const deltaTime = userSelectedDate - Date.now();
    if (deltaTime <= 0) {
      clearInterval(intervalId);
      updateUI(convertMs(0));
      refs.dateTimePicker.disabled = false;
      return;
    }

    updateUI(convertMs(deltaTime));
  }, 1000);
}

function onClose([selectedDate]) {
  refs.startBtn.disabled = true;

  if (!validateSelectedDate(selectedDate)) {
    return;
  }

  refs.startBtn.disabled = false;
  userSelectedDate = selectedDate;
}

function updateUI({ days, hours, minutes, seconds }) {
  refs.outputDays.textContent = addLeadingZero(days);
  refs.outputHours.textContent = addLeadingZero(hours);
  refs.outputMinutes.textContent = addLeadingZero(minutes);
  refs.outputSeconds.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function validateSelectedDate(date) {
  if (!date || date.getTime() <= Date.now()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
    return false;
  }
  return true;
}
