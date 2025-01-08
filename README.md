# Copilot Test

This repository provides a basic example and a more complex example. Each directory contains two (.ts) files and one test (.test.ts) file. In other words, one (.ts) file is missing a corresponding test (.test.ts) file. The goal is to generate the missing test file for each directory using Copilot.

For the basic example, Copilot should be able to generate a working test file without issue. For the more complex example, Copilot should have more difficulty generating a working test file.

This exercise is meant to bring to light clever prompts and strategies to help Copilot generate accurate code, when working with complex codebases.

## Getting Started

For reference, here's the prompt I've been using. Variations of this prompt generated the two files in the "generated-code" directory. This directory contains a working test file for the basic example and a broken test file for the complex example.

```
I have provided a .ts file (file1: merge-transform-and-send.ts) without a corresponding .test.ts file.

I have provided another .ts file (file2: parse-object-and-send.ts) with a corresponding .test.ts file (test-file2: parse-object-and-send.test.ts).

Use file2 and test-file2 as a guide. Create a new test file with tests for file1. Make the mock objects in the tests for file1 very similar to those in test-file2. Make the mock objects identical if possible.

Write all tests, for all edge cases, to achieve 100% test coverage.
```

### What's Broken in the Generated Test File for the Complex Example?

I've provided a generated test file for the complex example in the "generated-code" directory. I can see two primary issues with this test file. I list these issues below, along with suggested prompts to fix these issues.

When I run the two prompts suggested below, Copilot generally fixes these two primary issues. However, for the most part, one or two smaller issues will still be present.

1.) The test file contains type errors related to array references on the mock objects.

Here's an example:

```typescript
...MOCK_INPUT_1.arrayOfStrings
```

The arrayOfStrings property could be several types. It's not set to an array type. Several tests assume the mock properties arrayOfStrings, arrayOfBooleans, etc., are set to an array type. We need to use type assertions to indicate that these properties conform to the array type. Here's an example of how to fix this issue:

```typescript
...(MOCK_INPUT_1.arrayOfStrings as Array<string>)
```

I run the following prompt to fix this issue:

```
Update the tests referencing mock arrays to use the format provided below:
...(MOCK_INPUT_1.arrayOfNumbers as Array<number>),
...(MOCK_INPUT_2.arrayOfNumbers as Array<number>),
```

2.) Most of the time, Copilot will generate a MOCK_DATA or MOCK_RESPONSE constant, which it will use as the mock response data returned from axios in the mergeTransformAndSend function. This MOCK_DATA is used in expect statements for several tests. Instead, a new EXPECT_DATA constant should have been created and used. In the mergeTransformAndSend function, a new object is created with transformed properties and values from the MOCK_DATA constant. These transformed properties and values should be reflected in the EXPECT_DATA constant. For instance, all properties provided in the MOCK_DATA constant should be transformed from camelCase to snake_case in the EXPECT_DATA constant.

I use the following prompt to fix this issue:

```
MOCK_DATA is used as part of expect statements in these tests. Instead, create a new constant called EXPECT_DATA. This constant should contain transformed properties and values. Use this constant in place of MOCK_DATA in expect statements.
```
