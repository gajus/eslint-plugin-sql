import {
  type InvalidTestCase,
  RuleTester,
  type ValidTestCase,
} from '@typescript-eslint/rule-tester';
import { type RuleModule } from '@typescript-eslint/utils/eslint-utils';
import * as test from 'mocha';

if (typeof global.it === 'function') {
  RuleTester.afterAll = test.after;
} else {
  RuleTester.afterAll = () => {};
  RuleTester.describe = () => {};
}

export type TestCases<
  TMessageIds extends string,
  TOptions extends readonly unknown[] = [],
> = {
  invalid: Array<InvalidTestCase<TMessageIds, TOptions>>;
  valid: Array<ValidTestCase<TOptions>>;
};

export const createRuleTester = <
  TMessageIds extends string,
  TOptions extends readonly unknown[] = [],
>(
  ruleName: string,
  rule: RuleModule<TMessageIds, TOptions>,
  parameters: ConstructorParameters<typeof RuleTester>[0],
  testCases: TestCases<TMessageIds, TOptions>,
) => {
  const ruleTester = new RuleTester(parameters);

  ruleTester.run(ruleName, rule, testCases);

  return {
    testCases,
  };
};
