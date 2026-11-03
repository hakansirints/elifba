import test from 'node:test';
import assert from 'node:assert/strict';
import { QUIZ_15_QUESTIONS } from '../src/data/page15Quiz.js';

test('Page 15 Quiz has 10 high-quality questions matching Page 15 curriculum', () => {
  assert.equal(QUIZ_15_QUESTIONS.length, 10, 'Must have exactly 10 questions');

  QUIZ_15_QUESTIONS.forEach((q, idx) => {
    assert.equal(q.id, idx + 1, `Question ${idx + 1} has proper ID`);
    assert.ok(q.questionTr && q.questionTr.length > 5, `Question ${idx + 1} has Turkish text`);
    assert.ok(q.questionDe && q.questionDe.length > 5, `Question ${idx + 1} has German text`);
    assert.ok(q.ruleHintTr && q.ruleHintTr.length > 5, `Question ${idx + 1} has Turkish rule explanation`);
    assert.ok(q.ruleHintDe && q.ruleHintDe.length > 5, `Question ${idx + 1} has German rule explanation`);

    assert.equal(q.options.length, 4, `Question ${idx + 1} must have 4 options`);

    const correctOptions = q.options.filter(o => o.correct === true);
    assert.equal(correctOptions.length, 1, `Question ${idx + 1} must have exactly one correct option`);

    const colors = q.options.map(o => o.color);
    assert.deepEqual(colors, ['red', 'blue', 'yellow', 'green'], `Question ${idx + 1} has 4 distinct Kahoot colors`);

    const shapes = q.options.map(o => o.shape);
    assert.deepEqual(shapes, ['▲', '◆', '●', '■'], `Question ${idx + 1} has standard Kahoot geometric shapes`);

    q.options.forEach(opt => {
      assert.ok(opt.textTr, `Option ${opt.id} in Q${idx + 1} has Turkish text`);
      assert.ok(opt.textDe, `Option ${opt.id} in Q${idx + 1} has German text`);
    });
  });
});

test('Page 15 Quiz covers all key rules on Page 15', () => {
  // Q1: 28 letters
  assert.equal(QUIZ_15_QUESTIONS[0].options.find(o => o.correct).id, 'B');
  // Q2: Lamelif is combination
  assert.equal(QUIZ_15_QUESTIONS[1].options.find(o => o.correct).id, 'A');
  // Q3: 7 bold letters
  assert.equal(QUIZ_15_QUESTIONS[2].options.find(o => o.correct).id, 'B');
  // Q4: Sad is bold
  assert.equal(QUIZ_15_QUESTIONS[3].options.find(o => o.correct).char, 'ص');
  // Q5: Cim is thin
  assert.equal(QUIZ_15_QUESTIONS[4].options.find(o => o.correct).char, 'ج');
  // Q6: Ra special
  assert.equal(QUIZ_15_QUESTIONS[5].options.find(o => o.correct).id, 'C');
  // Q7: 3 lisping letters
  assert.equal(QUIZ_15_QUESTIONS[6].options.find(o => o.correct).id, 'B');
  // Q8: Se is lisping
  assert.equal(QUIZ_15_QUESTIONS[7].options.find(o => o.correct).char, 'ث');
  // Q9: 6 non-connecting letters
  assert.equal(QUIZ_15_QUESTIONS[8].options.find(o => o.correct).id, 'C');
  // Q10: Dal does not connect forward
  assert.equal(QUIZ_15_QUESTIONS[9].options.find(o => o.correct).char, 'د');
});
