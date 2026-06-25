//  @ts-check

/** @type {import('prettier').Config} */
//const config = {
//  semi: false,
//  singleQuote: true,
//  trailingComma: 'all',
//}

const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "twMerge"],
};

export default config;
