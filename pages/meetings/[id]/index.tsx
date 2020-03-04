import {
  Box,
  Heading,
  Text,
  Button,
  ButtonProps,
  Avatar,
  Flex,
  Textarea,
  Theme,
  Input,
} from "theme-ui";
import { get } from "@theme-ui/css";
import { Edit, CheckSquare } from "react-feather";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Datepicker from "react-datepicker";
import { useTranslation } from "react-i18next";

import { Id, Meeting, User } from "../../../src/app/types";
import { meetingsApi } from "../../../src/app/api";
import { MeetingDetailsImage, Page } from "../../../src/app/components";
import { Link } from "../../../src/lib";
import { Dl } from "../../../src/ui";
import { MaxWidthContainer } from "../../../src/app/components/MaxWidthContainer";

interface EditMeetingButtonProps {
  isEditing: boolean;
  onStartEdit: React.ReactEventHandler;
  onFinishEdit: React.ReactEventHandler;
}
const EditMeetingButton = ({
  isEditing,
  onStartEdit,
  onFinishEdit,
  ...rest
}: EditMeetingButtonProps) => {
  const props: ButtonProps = {
    title: "Edit meeting",
    ...rest,
  };

  return isEditing ? (
    <Button type="button" onClick={onFinishEdit} {...props}>
      Confirm
      <CheckSquare
        size={18}
        sx={{
          ml: 2,
          verticalAlign: "text-bottom",
        }}
      />
    </Button>
  ) : (
    <Button type="button" onClick={onStartEdit} {...props}>
      Edit
      <Edit size={18} sx={{ ml: 2, verticalAlign: "text-bottom" }} />
    </Button>
  );
};

type Query = { id: Id };

interface InitialProps {
  meeting?: Meeting;
}

export function MeetingDetailsPage({ meeting }: InitialProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<Meeting>({
    defaultValues: {
      ...meeting,
    },
  });

  const onSubmit = form.handleSubmit(value => {
    console.log("Meeting edited", { value, errors: form.errors });
    setIsEditing(false);
  });

  if (!meeting) {
    return "404: Couldn't find meeting.";
  }

  const linkToAuthor = (children: React.ReactChild) => (
    <Link
      href="/u/[username_slug]"
      as={`/u/${meeting.author.slug}`}
      sx={{ fontWeight: "bold", display: "inline-flex" }}
    >
      {children}
    </Link>
  );

  return (
    <Page>
      {meeting.image ? (
        <>
          <MeetingDetailsImage image={meeting.image} />
          <Box pt={4} />
        </>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "calc(240px + 2em)",
            p: 2,
          }}
          bg="gray.3"
        >
          <Button type="button" variant="secondary">
            Add featured picture
          </Button>
        </Box>
      )}
      <MaxWidthContainer
        bg="white"
        as={isEditing ? "form" : "article"}
        ref={formRef as any /* as React.Ref<HTMLFormElement> */}
        onSubmit={onSubmit}
        p={3}
        sx={{
          borderRadius: "rounded-lg",
          boxShadow: "sm",
          zIndex: 1,
          mt:
            meeting.image?.kind !== "background"
              ? (th: Theme) => `-${get(th, "space.3")}px`
              : 0,
        }}
      >
        <header>
          <Flex sx={{ alignItems: "center" }}>
            {meeting.start_time && (
              <Flex
                sx={{
                  alignItems: "center",
                  color: "gray.9",
                  "@media (hover: hover)": {
                    "> button": {
                      opacity: 0.2,
                    },
                    ":hover > button": {
                      opacity: 1,
                    },
                  },
                }}
              >
                {isEditing ? (
                  <Datepicker
                    selected={
                      form.getValues().start_time
                        ? new Date(form.getValues().start_time!)
                        : null
                    }
                    onChange={date => {
                      form.setValue("date", date || undefined);
                    }}
                  />
                ) : (
                  <Text as="span" sx={{ padding: 1, fontWeight: 500 }}>
                    {new Date(meeting.start_time).toLocaleString("pl-PL")}
                  </Text>
                )}
              </Flex>
            )}
            <div role="group" sx={{ marginLeft: "auto" }}>
              <EditMeetingButton
                isEditing={isEditing}
                onStartEdit={() => setIsEditing(true)}
                onFinishEdit={() => {
                  if (formRef.current) {
                    formRef.current.dispatchEvent(new Event("submit"));
                  }
                }}
              />
            </div>
          </Flex>
          {isEditing ? (
            <Input
              mt={1}
              mb={3}
              sx={{
                boxSizing: "border-box",
                margin: 0,
                padding: 0,
                minWidth: 0,
                // TODO: this shouldn't be copied
                fontSize: 7,
                letterSpacing: "-0.049375rem",
                border: "none",
                fontFamily: "inherit",
                fontWeight: "heading",
                lineHeight: "heading",
                marginTop: "4px",
                marginBottom: "16px",
                backgroundColor: "background",
                borderRadius: "rounded",
              }}
              name="title"
              ref={form.register({ minLength: 4 })}
            />
          ) : (
            <Heading mt={1} mb={3}>
              {meeting.title}
            </Heading>
          )}

          <Flex mb={3} sx={{ flexDirection: "row", alignItems: "center" }}>
            {linkToAuthor(
              <Avatar
                src={User.avatar(meeting.author) || ""}
                bg="primaryDark"
                sx={{
                  borderRadius: "50%",
                }}
              />
            )}
            <div sx={{ ml: 2, fontSize: 3 }}>
              <Text as="span">Hosted by </Text>
              {linkToAuthor(meeting.author.name)}
            </div>
          </Flex>
        </header>
        <Dl sx={{ mt: 2 }}>
          <dt>Opublikowano</dt>
          <dd>
            {meeting.published_at
              ? new Date(meeting.published_at).toLocaleString("pl-PL")
              : t("not-published")}
          </dd>
          <dt>Utworzono</dt>
          <dd>
            {meeting.created_at &&
              new Date(meeting.created_at).toLocaleString("pl-PL")}
          </dd>
        </Dl>
        <section sx={{ mt: 3 }}>
          <Heading as="h3" sx={{ fontSize: 3, mb: 2 }}>
            {t("meeting-description")}
          </Heading>
          {isEditing ? (
            <Textarea
              rows={5}
              sx={{ resize: "none" }}
              name="description"
              ref={form.register()}
            />
          ) : (
            <p sx={{ mt: 0 }}>{meeting.description}</p>
          )}
        </section>
      </MaxWidthContainer>
    </Page>
  );
}

MeetingDetailsPage.getInitialProps = async ({
  query,
}: {
  res: Response;
  req: Request;
  query: Query;
}): Promise<InitialProps> => {
  const meeting = await meetingsApi.get(query.id);
  return { meeting };
};

export default MeetingDetailsPage;
