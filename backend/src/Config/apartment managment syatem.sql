CREATE SCHEMA "public";
CREATE TABLE "communityhallbooking" (
	"bookingid" varchar(50) PRIMARY KEY,
	"memberid" varchar(50) NOT NULL,
	"hall" varchar(50) NOT NULL,
	"date" date NOT NULL,
	"timeslot" varchar(50) NOT NULL,
	"purpose" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL
);
CREATE TABLE "complaints" (
	"complaintid" varchar(10) PRIMARY KEY,
	"memberid" varchar(10) NOT NULL,
	"description" text NOT NULL,
	"createddate" date NOT NULL,
	"imageurl" text,
	"status" varchar(20) DEFAULT 'Pending',
	"resolveddate" date
);
CREATE TABLE "maintenance" (
	"maintenanceid" varchar(50) PRIMARY KEY,
	"memberid" varchar(50) NOT NULL,
	"duedate" date NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" varchar(50) NOT NULL,
	"paymentdate" date,
	"transactionid" varchar(100)
);
CREATE TABLE "members" (
	"memberid" varchar(50) PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"apartmentnumber" varchar(50) NOT NULL CONSTRAINT "members_apartmentnumber_key" UNIQUE,
	"contact" varchar(15) NOT NULL,
	"email" varchar(255) NOT NULL CONSTRAINT "members_email_key" UNIQUE,
	"wing" varchar(15) NOT NULL,
	"family_members" varchar(15) NOT NULL,
	"joiningdate" timestamp NOT NULL,
	"status" varchar(50) NOT NULL,
	"password" varchar(255)
);
CREATE TABLE "noticeboard" (
	"noticeid" varchar(50) PRIMARY KEY,
	"title" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"createddate" timestamp NOT NULL,
	"expirationdate" timestamp,
	"venue" varchar(100)
);
CREATE TABLE "vehicleinfo" (
	"vehicleid" varchar(50) PRIMARY KEY,
	"apartmentnumber" varchar(50) NOT NULL,
	"vehiclenumber" varchar(50) NOT NULL CONSTRAINT "vehicleinfo_vehiclenumber_key" UNIQUE,
	"vehicletype" varchar(50) NOT NULL
);
CREATE TABLE "visitorinfo" (
	"visitorid" varchar(50) PRIMARY KEY,
	"visitorname" varchar(255) NOT NULL,
	"apartmentnumber" varchar(20) NOT NULL,
	"purpose" varchar(50) NOT NULL,
	"contact" varchar(15),
	"status" varchar(30),
	"indatetime" timestamp NOT NULL,
	"outdatetime" timestamp
);
CREATE UNIQUE INDEX "communityhallbooking_pkey" ON "communityhallbooking" ("bookingid");
CREATE UNIQUE INDEX "complaints_pkey" ON "complaints" ("complaintid");
CREATE UNIQUE INDEX "maintenance_pkey" ON "maintenance" ("maintenanceid");
CREATE UNIQUE INDEX "members_apartmentnumber_key" ON "members" ("apartmentnumber");
CREATE UNIQUE INDEX "members_email_key" ON "members" ("email");
CREATE UNIQUE INDEX "members_pkey" ON "members" ("memberid");
CREATE UNIQUE INDEX "noticeboard_pkey" ON "noticeboard" ("noticeid");
CREATE UNIQUE INDEX "vehicleinfo_pkey" ON "vehicleinfo" ("vehicleid");
CREATE UNIQUE INDEX "vehicleinfo_vehiclenumber_key" ON "vehicleinfo" ("vehiclenumber");
CREATE UNIQUE INDEX "visitorinfo_pkey" ON "visitorinfo" ("visitorid");
ALTER TABLE "communityhallbooking" ADD CONSTRAINT "communityhallbooking_memberid_fkey" FOREIGN KEY ("memberid") REFERENCES "members"("memberid") ON DELETE CASCADE;
ALTER TABLE "maintenance" ADD CONSTRAINT "maintenance_memberid_fkey" FOREIGN KEY ("memberid") REFERENCES "members"("memberid") ON DELETE CASCADE;
ALTER TABLE "vehicleinfo" ADD CONSTRAINT "vehicleinfo_apartmentnumber_fkey" FOREIGN KEY ("apartmentnumber") REFERENCES "members"("apartmentnumber") ON DELETE CASCADE;
ALTER TABLE "visitorinfo" ADD CONSTRAINT "visitorinfo_apartmentnumber_fkey" FOREIGN KEY ("apartmentnumber") REFERENCES "members"("apartmentnumber") ON DELETE CASCADE; 	