let onUnauthorized = null;

export const registerUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

export const triggerUnauthorized = () => {
  onUnauthorized?.();
};
