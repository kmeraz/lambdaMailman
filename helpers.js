function isTestEnv(process) {
  if (process.env.NODE_ENV === 'test') return true;
  return false;
}

module.exports = {
  isTestEnv
};
