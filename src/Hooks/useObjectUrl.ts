import { useMemo } from "react";


export const useObjectUrl = (file: File | undefined) => {
  return useMemo(() => {
    return file ? window.URL.createObjectURL(file) : null;
  }, [file]);
};