namespace DeployEmailGenerator;

public static class DeployEmailGeneratorConstants
{
    // Email template constants
    public const string EmailTemplate =
        @"Деплойната нова версия на {0}

Здравейте, колеги.

Деплойнахме нова версия на следните системи:

{1}

Във версия влязоха следните ишута:

{2}

Дев екипът пожелава на всички успешен ден!";

    public const string EmailTemplatePreDeploy =
        @"Предстоящ деплой на {0}

Здравейте, колеги.

На ........ ще деплойнем нова версия на следните системи:

{1}

Във версия ще влязат следните ишута:

{2}

Дев екипът пожелава на всички успешен ден!";

    public const string EmailDraftSavedSuccessMessage = "The email draft was saved successfully at {0}";
}