import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '15',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif',
    );

    const data = ffmpeg.FS('readFile', 'out.gif');

    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' }),
    );
    setGif(url);
  };

  return ready ? (
    <div className="App">
      <p className="title">GIF MAKER</p>
      {video && (
        <video controls width="720" src={URL.createObjectURL(video)}></video>
      )}
      <input
        className="select-file"
        type="file"
        onChange={(e) => setVideo(e.target.files?.item(e))}
      />
      <h3>Resultado</h3>
      <button className="button" onClick={convertToGif}>
        Convertir
      </button>
      {gif && <img src={gif} width="720" />}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
