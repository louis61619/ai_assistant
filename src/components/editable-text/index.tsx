import { useEffect, useRef, useState } from 'react';

type Props = {
  text: string;
  onSave: (name: string) => void;
  active: boolean;
};

export const EdittableText = (props: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(props.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      props.onSave(text);
    }
  };

  const onBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      setText(props.text);
    }
  };

  // useEffect(() => {
  //   const onClick = (e: MouseEvent) => {
  //     if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
  //       setIsEditing(false);
  //     }
  //   };
  //   window.addEventListener('click', onClick);
  //   return () => {
  //     window.removeEventListener('click', onClick);
  //   };
  // }, []);

  if (isEditing) {
    return (
      <input
        className="max-w-full border-0 bg-gray-300 py-2 outline-none"
        value={text}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        ref={inputRef}
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={(e) => {
        if (props.active) {
          e.stopPropagation();
          setIsEditing(true);
        }
      }}
      className="flex-1 overflow-hidden text-ellipsis"
    >
      {text}
    </div>
  );
};
