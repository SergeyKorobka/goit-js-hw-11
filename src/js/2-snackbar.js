import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

iziToast.settings({
  timeout: 3000,
  pauseOnHover: true,
  position: 'topRight',
});

const refs = {
  form: document.querySelector('.form'),
};

refs.form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();

  const { delay, state } = e.target.elements;

  const delayValue = Number(delay.value);
  const stateValue = state.value;

  createPromise(delayValue, stateValue).then(onFulfilled).catch(onRejected);
}

function createPromise(delay, state) {
  return new Promise((resolve, rejected) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        rejected(delay);
      }
    }, delay);
  });
}

function onFulfilled(delay) {
  iziToast.success({
    message: `✅ Fulfilled promise in ${delay}ms`,
  });
}

function onRejected(delay) {
  iziToast.error({
    message: `❌ Rejected promise in ${delay}ms`,
  });
}
