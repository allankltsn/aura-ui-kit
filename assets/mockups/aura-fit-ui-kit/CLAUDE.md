# aura-fit — Engineering Guidelines

This repository is the base for a reusable `.claude/` engineering template: a set of
domain-specialist subagents plus project rules that get copied into projects using
the stack below.

## Stack

- Python (backend, framework varies by project — see the `python` agent)
- NestJS 10, TypeScript 5
- MikroORM 6, PostgreSQL
- AWS Lambda, API Gateway, Cognito, S3
- Infrastructure as code: AWS SAM, Terraform

## Process

Use the Superpowers skills for the development workflow — this file does not define
its own gates:

- `superpowers:brainstorming` for turning a request into an approved spec/design.
- `superpowers:writing-plans` for turning an approved design into an implementation
  plan.
- `superpowers:executing-plans` or `superpowers:subagent-driven-development` for
  implementation.
- `superpowers:verification-before-completion` before declaring anything done.
- `superpowers:requesting-code-review` / `superpowers:receiving-code-review` for
  review feedback.

## Delegating to domain specialists

The Superpowers skills above control *when* to design, plan, implement, and verify.
They don't know this project's stack. At each of those steps, delegate to the
matching specialist subagent instead of relying on generic knowledge:

| Step | Agent |
|---|---|
| Propose architecture / design | `architect` |
| Implement backend (Node/NestJS) | `backend` |
| Implement backend (Python) | `python` |
| Design or review AWS infrastructure | `aws` |
| Before marking something done | `qa`, `security` |

Quick, standalone checks (outside a full feature workflow) are available as
`/qa`, `/security`, and `/aws`.

## Security rules

- Never log access tokens, refresh tokens, Cognito tokens, API keys, or passwords.
- Follow least privilege for every IAM policy and role.
- Never commit credentials or secrets, in code or in Terraform/SAM state.

## Actions requiring explicit human approval

Never take these actions without the user explicitly approving them first, even if
asked to "just do it":

- Deploying to production.
- Running a database migration against a production database.
- Changing an IAM policy or role.
- Any destructive AWS operation (deleting a resource, emptying a bucket, etc.).
- Rotating credentials or secrets.

## Definition of done

Before treating a feature or fix as complete, run
`superpowers:verification-before-completion`, and within it, have the `qa` and
`security` agents review the change. Do not substitute your own judgment for theirs
on adversarial testing or security review.
