import { Box } from "components/box/Box";
import { Divider } from "components/divider/Divider";
import { Paragraph } from "components/paragraph/Paragraph";
import { StarRate } from "components/star-rate/StarRate";
import React, { FC } from "react";

export const RatingSection: FC = () => {
  return (
    <div id="rating">
      <Divider title="Rating" />
      <Paragraph
        body={[
          "Atractiveness - though subjective I try to asses the trips according to some factors. I value uniqeness of the landscape - views on the path, detachment from civilization, shape of terrain. I prefer quieter paths with less tourists around. For scrambling/climbing/ferrata trips the quality of the rock and how the trail line is dragged within is what matters. In the end, I may rate the trip based on endorphines it provoked.",
        ]}
      />
      <Box margin="8px 0">
        <StarRate rate={1} comment=" - for connoisseurs only" />
      </Box>
      <Box margin="8px 0">
        <StarRate rate={2} comment=" - you probably have seen better" />
      </Box>
      <Box margin="8px 0">
        <StarRate rate={3} comment=" - good enough" />
      </Box>
      <Box margin="8px 0">
        <StarRate rate={4} comment=" - really worth the effort" />
      </Box>
      <Box margin="8px 0">
        <StarRate rate={5} comment=" - trip of your lifetime" />
      </Box>
      <Paragraph
        body={[
          "Condition - I rate the trip according to my overall effort experience. As we are all aware that can vary depending on physical and mental state. Lack of sleep, improper nutrition, past infections, work overload - all of that matters on the way and believe me will step in sooner or later. Sometimes we are tricked by our minds and only the numbers like distance and speed show the facts. I look mostly from the intensity perspective - so a lot of condensed ascents in short time in uneven terrain will be rated higher than long walk in more approachable and relatively mild one.",
        ]}
      />
      <Box margin="8px 0">
        <StarRate
          rate={1}
          comment=" - tiny to small effort, lack of steep ascents and descents, mostly under 3 hours , no difference in bodily fatigue before or after trip"
        />
      </Box>
      <Box margin="8px 0">
        <StarRate
          rate={2}
          comment=" - small effort, limited number of milder ascents and descents, occassional short steep ascents, feels good to be seated afterwards "
        />
      </Box>
      <Box margin="8px 0">
        <StarRate
          rate={3}
          comment=" - noticeable effort, longer strechtes of ascents with steeper sections, experienced pleasant fatigue but nothing a good night sleep wouldn't cure"
        />
      </Box>
      <Box margin="8px 0">
        <StarRate
          rate={4}
          comment=" - significant effort, long steep climbing sections or long distance with fluctuating altitude, evening won't take long and probably absolute freshness in the morning is out of question. Repeating the trip next day is not considered as pleasant."
        />
      </Box>
      <Box margin="8px 0">
        <StarRate
          rate={5}
          comment=" - huge to extreme effort, long and time consuming steep climbing sections or very long distance walk with relatively steep stretches, scenario where you are able or barely able to grab something to eat before falling asleep. Repeating the same trip the following day is unlikely."
        />
      </Box>
    </div>
  );
};
