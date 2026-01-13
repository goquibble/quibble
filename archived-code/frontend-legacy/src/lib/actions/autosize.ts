// https://github.com/jesseskinner/svelte-autosize/blob/main/index.js
import autosize from 'autosize';

const action = (node: HTMLTextAreaElement) => {
  autosize(node);

  return {
    destroy() {
      autosize.destroy(node);
    }
  };
};

action.update = autosize.update;
action.destroy = autosize.destroy;

export default action;
