export default {
  "*.ts": (filenames) => [
    `eslint --fix '${filenames.join("' '")}'`,
    `prettier --write '${filenames.join("' '")}'`,
  ],
  // "*.scss": (filenames) => `stylelint --fix ${filenames.join(" ")}`,
};
