
CREATE TABLE "Event"."Events"
(
    "EventId" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "Name" character varying(200) COLLATE pg_catalog."default" NOT NULL,
    "Description" character varying(4000) COLLATE pg_catalog."default" NOT NULL,
    "Location" character varying(200) COLLATE pg_catalog."default" NOT NULL,
    "Date" date NOT NULL,
    CONSTRAINT "Events_pkey" PRIMARY KEY ("EventId")
)
WITH (
    OIDS = FALSE
)

CREATE TABLE "Event"."Attendees"
(
    "AttendeeId" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "EventId" integer NOT NULL,
    "Username" character varying(200) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Attendees_pkey" PRIMARY KEY ("AttendeeId"),
    CONSTRAINT "EventAttendeeFK" FOREIGN KEY ("EventId")
        REFERENCES "Event"."Events" ("EventId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)


-- Examples for some mock data

-- INSERT INTO "Event"."Events"("Name", "Description", "Location", "Date")
-- VALUES ('DevDay Johannesburg', 'Where all the people go.', 'Barnyard Rivonia', '2019-10-10');

-- SELECT * FROM "Event"."Events"

-- INSERT INTO "Event"."Attendees" ("EventId", "Username")
-- VALUES (1, 'Werner')
-- , (1, 'Jandre')
-- , (1, 'Rian')

-- SELECT * FROM "Event"."Attendees"