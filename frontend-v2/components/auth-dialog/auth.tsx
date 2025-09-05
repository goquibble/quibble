import AuthForm from "../forms/auth-form";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function Auth() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="font-medium text-sm">Continue with Open account</span>
        <div className="grid grid-cols-2 gap-2.5">
          <Button variant={"outline"}>
            <Icons.google className="fill-primary" />
            Google
          </Button>
          <Button variant={"outline"} disabled>
            <Icons.github className="fill-primary" />
            GitHub
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <span className="font-medium text-sm">
          Or continue with email address
        </span>
        <AuthForm />
      </div>
      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="font-medium text-xs">NOTE</span>
        <Separator className="flex-1" />
      </div>
      <span className="text-center text-xs">
        Project is in development.
        <br />
        If you see any issues- please raise a ticket{" "}
        <a
          href="https://github.com/quibble-dev/Quibble/issues/new?template=bug_report.yml"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          here
        </a>
        .
      </span>
    </>
  );
}
