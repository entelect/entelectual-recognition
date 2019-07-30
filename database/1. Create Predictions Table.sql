/****** Object:  Table [dbo].[Predictions]    Script Date: 2019/07/30 19:55:09 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Predictions](
	[PredictionId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](500) NOT NULL,
	[Distance] [float] NOT NULL,
	[ImageId] [varchar](100) NOT NULL,
	[Timestamp] [datetime] NOT NULL,
 CONSTRAINT [PK_Prediction] PRIMARY KEY CLUSTERED 
(
	[PredictionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO