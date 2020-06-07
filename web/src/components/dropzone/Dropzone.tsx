import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './style.css';

interface Props {
  onFileUploaded: (file: any) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);

      setSelectedFileUrl(url);
      onFileUploaded(file);
    },
    [onFileUploaded],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ['image/png', 'image/jpg', 'image/jpeg'],
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {/* {isDragActive ? (
        <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )} */}

      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="Point thumbnail" />
      ) : (
        <p>
          <FiUpload />
          Insira uma imagem do estabelecimento
        </p>
      )}
    </div>
  );
};

export default Dropzone;
