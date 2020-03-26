import React, { useEffect } from 'react';
import Quagga from 'quagga';
import { validationIsbn } from '../../services/books';

import { Video } from './styles';

function Scanner() {
  let scannerAttemps = 0;
  const onDetected = result => {
    Quagga.offDetected(onDetected);

    const isbn = result.codeResult.code;

    if (validationIsbn(isbn)) {
      alert(`ISBN válido: ${isbn}`);
    } else if (scannerAttemps >= 5) {
      alert('Não é possível ler o código do livro, por favor, tente novamente');
    }

    scannerAttemps++;
    Quagga.onDetected(onDetected);
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: document.querySelector('#video'),
            constraints: {
              facingMode: 'environment',
            },
          },
          numOfWorkers: 1,
          locale: true,
          decoder: {
            readers: ['ean_reader'],
          },
        },
        err => {
          if (err) {
            console.error(err);
            alert(
              'Erro ao abrir a câmera do dispositivo, por favort, dê a permissão de uso.'
            );
            return;
          }

          Quagga.start();
        },
        Quagga.onDetected(onDetected)
      );
    }
  }, []);
  return <Video id="video" />;
}

export default Scanner;
