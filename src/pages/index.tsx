import React, { useEffect, useState } from 'react';

export default () => {
  const [count, setCount] = useState();
  const handleClick = async () => {
    const value = await fetch('/api').then((res) => res.json());
    setCount(value);
  };
  useEffect(() => {
    handleClick();
  }, []);

  return (
    <>
      <div>{count}</div>
      <button onClick={handleClick}>カウントアップ</button>
    </>
  );
};
