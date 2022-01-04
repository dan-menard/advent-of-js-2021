const symbols = '@#$%';
const numbers = '1234567890';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const similar = 'iI1Lo0O';

function makeMix(options) {
  let mix = '';

  if (options.includeSymbols) {
    mix += symbols;
  }

  if (options.includeNumbers) {
    mix += numbers;
  }

  if (options.includeLowercase) {
    mix += lowercase;
  }

  if (options.includeUppercase) {
    mix += uppercase;
  }

  if (!options.includeSimilar) {
    similar.split('').forEach((char) => {
      mix = mix.replace(char, '');
    });
  }

  return mix.split('');
}

export function generate(length, options) {
  const mix = makeMix(options);

  if (!mix.length) {
    return '(pick at least one option)';
  }

  let generated = '';

  for (let i=0; i<length; i++) {
    const randomIndex = Math.floor(Math.random() * mix.length);
    generated += mix[randomIndex];
  }

  return generated;
}
