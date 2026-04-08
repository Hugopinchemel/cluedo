<template>
  <div class="calc">
    <div class="calc-header">Standard</div>
    <!-- Display -->
    <div class="display">
      <div class="expression">{{ expression || '&nbsp;' }}</div>
      <div class="result">{{ display }}</div>
    </div>
    <!-- Memory row -->
    <div class="mem-row">
      <button :disabled="memory === 0" class="mem-btn" @click="memClear">MC</button>
      <button :disabled="memory === 0" class="mem-btn" @click="memRecall">MR</button>
      <button class="mem-btn" @click="memAdd">M+</button>
      <button class="mem-btn" @click="memSub">M-</button>
      <button class="mem-btn" @click="memStore">MS</button>
      <button class="mem-btn">M▾</button>
    </div>
    <!-- Buttons -->
    <div class="btn-grid">
      <button class="btn gray" @click="pct">%</button>
      <button class="btn gray" @click="clearEntry">CE</button>
      <button class="btn gray" @click="clear">C</button>
      <button class="btn gray" @click="backspace">⌫</button>

      <button class="btn gray" @click="fn('1/x')">¹⁄ₓ</button>
      <button class="btn gray" @click="fn('x²')">x²</button>
      <button class="btn gray" @click="fn('√')">²√x</button>
      <button class="btn accent" @click="op('÷')">÷</button>

      <button class="btn" @click="num('7')">7</button>
      <button class="btn" @click="num('8')">8</button>
      <button class="btn" @click="num('9')">9</button>
      <button class="btn accent" @click="op('×')">×</button>

      <button class="btn" @click="num('4')">4</button>
      <button class="btn" @click="num('5')">5</button>
      <button class="btn" @click="num('6')">6</button>
      <button class="btn accent" @click="op('-')">−</button>

      <button class="btn" @click="num('1')">1</button>
      <button class="btn" @click="num('2')">2</button>
      <button class="btn" @click="num('3')">3</button>
      <button class="btn accent" @click="op('+')">+</button>

      <button class="btn gray" @click="toggleSign">⁺⁄₋</button>
      <button class="btn" @click="num('0')">0</button>
      <button class="btn" @click="decimal">,</button>
      <button class="btn accent-eq" @click="equals">=</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const display = ref('0')
const expression = ref('')
const memory = ref(0)
let currentOp = ''
let prevValue = 0
let newInput = true

function num(n: string) {
  if (newInput) {
    display.value = n
    newInput = false
  } else {
    if (display.value === '0') display.value = n
    else if (display.value.length < 15) display.value += n
  }
}

function decimal() {
  if (newInput) {
    display.value = '0,';
    newInput = false;
    return
  }
  if (!display.value.includes(',')) display.value += ','
}

function op(o: string) {
  prevValue = parseFloat(display.value.replace(',', '.'))
  currentOp = o
  expression.value = `${display.value} ${o}`
  newInput = true
}

function equals() {
  const cur = parseFloat(display.value.replace(',', '.'))
  let result = cur
  if (currentOp === '+') result = prevValue + cur
  else if (currentOp === '-') result = prevValue - cur
  else if (currentOp === '×') result = prevValue * cur
  else if (currentOp === '÷') result = cur === 0 ? 0 : prevValue / cur
  expression.value = `${expression.value} ${display.value} =`
  display.value = String(result).replace('.', ',').slice(0, 15)
  currentOp = ''
  newInput = true
}

function clear() {
  display.value = '0';
  expression.value = '';
  currentOp = '';
  prevValue = 0;
  newInput = true
}

function clearEntry() {
  display.value = '0';
  newInput = true
}

function backspace() {
  if (newInput) return
  display.value = display.value.slice(0, -1) || '0'
}

function pct() {
  display.value = String(parseFloat(display.value.replace(',', '.')) / 100).replace('.', ',')
}

function toggleSign() {
  const v = parseFloat(display.value.replace(',', '.'))
  display.value = String(-v).replace('.', ',')
}

function fn(type: string) {
  const v = parseFloat(display.value.replace(',', '.'))
  if (type === '1/x') display.value = String(v === 0 ? 0 : 1 / v).replace('.', ',')
  else if (type === 'x²') display.value = String(v * v).replace('.', ',')
  else if (type === '√') display.value = String(Math.sqrt(v)).replace('.', ',')
  newInput = true
}

function memClear() {
  memory.value = 0
}

function memRecall() {
  display.value = String(memory.value).replace('.', ',');
  newInput = true
}

function memAdd() {
  memory.value += parseFloat(display.value.replace(',', '.'))
}

function memSub() {
  memory.value -= parseFloat(display.value.replace(',', '.'))
}

function memStore() {
  memory.value = parseFloat(display.value.replace(',', '.'))
}
</script>

<style scoped>
.calc {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1c1c1c;
  color: white;
  user-select: none;
}

.calc-header {
  padding: 12px 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.display {
  padding: 8px 16px 12px;
  text-align: right;
}

.expression {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  min-height: 20px;
  margin-bottom: 4px;
}

.result {
  font-size: 44px;
  font-weight: 300;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mem-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.mem-btn {
  padding: 8px 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  transition: background 0.1s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &:disabled {
    opacity: 0.3;
  }
}

.btn-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.06);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 300;
  background: #2d2d2d;
  color: white;
  transition: background 0.1s;
  border-radius: 0;

  &:hover {
    background: #3a3a3a;
  }

  &:active {
    background: #444;
  }

  &.gray {
    background: #323232;
    color: rgba(255, 255, 255, 0.9);
  }

  &.gray:hover {
    background: #3d3d3d;
  }

  &.accent {
    background: #333;
    color: var(--accent);
    font-size: 20px;
  }

  &.accent:hover {
    background: #3d3d3d;
  }

  &.accent-eq {
    background: var(--accent);
    color: white;
    font-size: 20px;

    &:hover {
      background: var(--accent-dark);
    }
  }
}
</style>
