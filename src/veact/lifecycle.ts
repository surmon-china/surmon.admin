/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react';

export function onMounted(callback: () => any) {
  useEffect(() => {
    callback();
  }, []);
}

export function onUnmount(callback: () => void) {
  useEffect(() => {
    return () => {
      callback();
    };
  }, []);
}

export function onUpdated(callback: () => void) {
  useEffect(() => {
    callback();
  });
}
