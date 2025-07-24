<GameFile>
  <PropertyGroup Name="battleUI" Type="Scene" ID="d1d8d3d5-9b12-4f60-9622-6e8f50181a88" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Scene" Tag="194" ctype="GameNodeObjectData">
        <Size X="960.0000" Y="640.0000" />
        <Children>
          <AbstractNodeData Name="endButton" ActionTag="890584596" Tag="195" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="28.0000" RightMargin="796.0000" TopMargin="451.0000" BottomMargin="131.0000" TouchEnable="True" FontSize="22" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="106" Scale9Height="36" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="136.0000" Y="58.0000" />
            <Children>
              <AbstractNodeData Name="endButtonText" ActionTag="-768123518" Tag="196" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="8.0000" RightMargin="8.0000" TopMargin="13.0000" BottomMargin="13.0000" IsCustomSize="True" FontSize="24" LabelText="Kết thúc" HorizontalAlignmentType="HT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="120.0000" Y="32.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="68.0000" Y="29.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.5000" />
                <PreSize X="0.8824" Y="0.5517" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="96.0000" Y="160.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.1000" Y="0.2500" />
            <PreSize X="0.1417" Y="0.0906" />
            <FontResource Type="Default" Path="" Plist="" />
            <TextColor A="255" R="255" G="255" B="255" />
            <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
            <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
            <NormalFileData Type="Normal" Path="Art/BattleUI/bt_003.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="troopToFight" ActionTag="834302408" Tag="240" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" TopMargin="512.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="179" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Enable="True" LeftEage="132" RightEage="86" TopEage="36" BottomEage="36" Scale9OriginX="132" Scale9OriginY="36" Scale9Width="45" Scale9Height="38" IsBounceEnabled="True" ScrollDirectionType="Horizontal" ctype="ScrollViewObjectData">
            <Size X="960.0000" Y="128.0000" />
            <Children>
              <AbstractNodeData Name="slot1" ActionTag="408511048" Tag="241" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="19.6800" RightMargin="868.3200" TopMargin="21.5000" BottomMargin="21.5000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="72.0000" Y="85.0000" />
                <Children>
                  <AbstractNodeData Name="troopIcon" ActionTag="-240339994" Tag="242" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                    <Size X="61.0000" Y="72.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.8472" Y="0.8471" />
                    <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="amountLabel" ActionTag="1209937197" Tag="244" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="26.0000" Y="27.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="72.2500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.8500" />
                    <PreSize X="0.3611" Y="0.3176" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="selectedTroopOutline" ActionTag="1842646481" Tag="58" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-2.0000" RightMargin="-2.0000" TopMargin="-2.5000" BottomMargin="-2.5000" LeftEage="25" RightEage="25" TopEage="29" BottomEage="29" Scale9OriginX="25" Scale9OriginY="29" Scale9Width="26" Scale9Height="32" ctype="ImageViewObjectData">
                    <Size X="76.0000" Y="90.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="1.0556" Y="1.0588" />
                    <FileData Type="Normal" Path="Art/BattleUI/select_troop.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="55.6800" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.0580" Y="0.5000" />
                <PreSize X="0.0750" Y="0.6641" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="slot2" ActionTag="-816835685" Tag="245" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="115.6800" RightMargin="772.3200" TopMargin="21.5000" BottomMargin="21.5000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="72.0000" Y="85.0000" />
                <Children>
                  <AbstractNodeData Name="troopIcon" ActionTag="-950320433" Tag="246" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                    <Size X="61.0000" Y="72.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.8472" Y="0.8471" />
                    <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="amountLabel" ActionTag="-452775808" Tag="248" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="26.0000" Y="27.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="72.2500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.8500" />
                    <PreSize X="0.3611" Y="0.3176" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="selectedTroopOutline" ActionTag="-951810308" Tag="59" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-2.0000" RightMargin="-2.0000" TopMargin="-2.5000" BottomMargin="-2.5000" LeftEage="25" RightEage="25" TopEage="29" BottomEage="29" Scale9OriginX="25" Scale9OriginY="29" Scale9Width="26" Scale9Height="32" ctype="ImageViewObjectData">
                    <Size X="76.0000" Y="90.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="1.0556" Y="1.0588" />
                    <FileData Type="Normal" Path="Art/BattleUI/select_troop.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="151.6800" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1580" Y="0.5000" />
                <PreSize X="0.0750" Y="0.6641" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="slot3" ActionTag="1319986558" Tag="249" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="211.6800" RightMargin="676.3200" TopMargin="21.5000" BottomMargin="21.5000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="72.0000" Y="85.0000" />
                <Children>
                  <AbstractNodeData Name="troopIcon" ActionTag="476768716" Tag="250" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                    <Size X="61.0000" Y="72.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.8472" Y="0.8471" />
                    <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="amountLabel" ActionTag="-1451009801" Tag="252" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="26.0000" Y="27.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="72.2500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.8500" />
                    <PreSize X="0.3611" Y="0.3176" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="selectedTroopOutline" ActionTag="1490255003" Tag="60" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-2.0000" RightMargin="-2.0000" TopMargin="-2.5000" BottomMargin="-2.5000" LeftEage="25" RightEage="25" TopEage="29" BottomEage="29" Scale9OriginX="25" Scale9OriginY="29" Scale9Width="26" Scale9Height="32" ctype="ImageViewObjectData">
                    <Size X="76.0000" Y="90.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="1.0556" Y="1.0588" />
                    <FileData Type="Normal" Path="Art/BattleUI/select_troop.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="247.6800" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2580" Y="0.5000" />
                <PreSize X="0.0750" Y="0.6641" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="slot4" ActionTag="-1858690888" Tag="253" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="307.6800" RightMargin="580.3199" TopMargin="21.5000" BottomMargin="21.5000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="72.0000" Y="85.0000" />
                <Children>
                  <AbstractNodeData Name="troopIcon" ActionTag="-152902743" Tag="254" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                    <Size X="61.0000" Y="72.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.8472" Y="0.8471" />
                    <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="amountLabel" ActionTag="1916772411" Tag="256" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="26.0000" Y="27.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="72.2500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.8500" />
                    <PreSize X="0.3611" Y="0.3176" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="selectedTroopOutline" ActionTag="-607542439" Tag="61" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-2.0000" RightMargin="-2.0000" TopMargin="-2.5000" BottomMargin="-2.5000" LeftEage="25" RightEage="25" TopEage="29" BottomEage="29" Scale9OriginX="25" Scale9OriginY="29" Scale9Width="26" Scale9Height="32" ctype="ImageViewObjectData">
                    <Size X="76.0000" Y="90.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="1.0556" Y="1.0588" />
                    <FileData Type="Normal" Path="Art/BattleUI/select_troop.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="343.6800" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3580" Y="0.5000" />
                <PreSize X="0.0750" Y="0.6641" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="slot5" ActionTag="-2006848697" Tag="257" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="403.6800" RightMargin="484.3200" TopMargin="21.5000" BottomMargin="21.5000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="72.0000" Y="85.0000" />
                <Children>
                  <AbstractNodeData Name="troopIcon" ActionTag="270495625" Tag="258" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                    <Size X="61.0000" Y="72.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.8472" Y="0.8471" />
                    <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="amountLabel" ActionTag="-480403404" Tag="260" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="26.0000" Y="27.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="72.2500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.8500" />
                    <PreSize X="0.3611" Y="0.3176" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="selectedTroopOutline" ActionTag="-360011404" Tag="62" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-2.0000" RightMargin="-2.0000" TopMargin="-2.5000" BottomMargin="-2.5000" LeftEage="25" RightEage="25" TopEage="29" BottomEage="29" Scale9OriginX="25" Scale9OriginY="29" Scale9Width="26" Scale9Height="32" ctype="ImageViewObjectData">
                    <Size X="76.0000" Y="90.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="1.0556" Y="1.0588" />
                    <FileData Type="Normal" Path="Art/BattleUI/select_troop.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="439.6800" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4580" Y="0.5000" />
                <PreSize X="0.0750" Y="0.6641" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="slot6" ActionTag="-1021132788" Tag="261" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="499.6801" RightMargin="388.3199" TopMargin="21.5000" BottomMargin="21.5000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="72.0000" Y="85.0000" />
                <Children>
                  <AbstractNodeData Name="troopIcon" ActionTag="2097947189" Tag="262" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                    <Size X="61.0000" Y="72.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.8472" Y="0.8471" />
                    <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="amountLabel" ActionTag="975465327" Tag="264" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="26.0000" Y="27.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="72.2500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.8500" />
                    <PreSize X="0.3611" Y="0.3176" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="selectedTroopOutline" ActionTag="219787750" Tag="63" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-2.0000" RightMargin="-2.0000" TopMargin="-2.5000" BottomMargin="-2.5000" LeftEage="25" RightEage="25" TopEage="29" BottomEage="29" Scale9OriginX="25" Scale9OriginY="29" Scale9Width="26" Scale9Height="32" ctype="ImageViewObjectData">
                    <Size X="76.0000" Y="90.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="1.0556" Y="1.0588" />
                    <FileData Type="Normal" Path="Art/BattleUI/select_troop.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="535.6801" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5580" Y="0.5000" />
                <PreSize X="0.0750" Y="0.6641" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="slot7" ActionTag="514859340" Tag="265" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="595.6800" RightMargin="292.3200" TopMargin="21.5000" BottomMargin="21.5000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="72.0000" Y="85.0000" />
                <Children>
                  <AbstractNodeData Name="troopIcon" ActionTag="-722456800" Tag="266" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                    <Size X="61.0000" Y="72.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.8472" Y="0.8471" />
                    <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="amountLabel" ActionTag="-290298437" Tag="268" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="26.0000" Y="27.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="72.2500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.8500" />
                    <PreSize X="0.3611" Y="0.3176" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="selectedTroopOutline" ActionTag="-1895974741" Tag="64" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-2.0000" RightMargin="-2.0000" TopMargin="-2.5000" BottomMargin="-2.5000" LeftEage="25" RightEage="25" TopEage="29" BottomEage="29" Scale9OriginX="25" Scale9OriginY="29" Scale9Width="26" Scale9Height="32" ctype="ImageViewObjectData">
                    <Size X="76.0000" Y="90.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="1.0556" Y="1.0588" />
                    <FileData Type="Normal" Path="Art/BattleUI/select_troop.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="631.6800" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.6580" Y="0.5000" />
                <PreSize X="0.0750" Y="0.6641" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="slot8" ActionTag="120605434" Tag="269" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="691.6800" RightMargin="196.3200" TopMargin="21.5000" BottomMargin="21.5000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="72.0000" Y="85.0000" />
                <Children>
                  <AbstractNodeData Name="troopIcon" ActionTag="1373559074" Tag="270" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                    <Size X="61.0000" Y="72.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.8472" Y="0.8471" />
                    <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="amountLabel" ActionTag="1825912623" Tag="272" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="26.0000" Y="27.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="72.2500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.8500" />
                    <PreSize X="0.3611" Y="0.3176" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="selectedTroopOutline" ActionTag="-491498476" Tag="65" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-2.0000" RightMargin="-2.0000" TopMargin="-2.5000" BottomMargin="-2.5000" LeftEage="25" RightEage="25" TopEage="29" BottomEage="29" Scale9OriginX="25" Scale9OriginY="29" Scale9Width="26" Scale9Height="32" ctype="ImageViewObjectData">
                    <Size X="76.0000" Y="90.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="1.0556" Y="1.0588" />
                    <FileData Type="Normal" Path="Art/BattleUI/select_troop.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="727.6800" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7580" Y="0.5000" />
                <PreSize X="0.0750" Y="0.6641" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="slot9" ActionTag="990580526" Tag="273" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="787.6800" RightMargin="100.3200" TopMargin="21.5000" BottomMargin="21.5000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="72.0000" Y="85.0000" />
                <Children>
                  <AbstractNodeData Name="troopIcon" ActionTag="704334003" Tag="274" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                    <Size X="61.0000" Y="72.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.8472" Y="0.8471" />
                    <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="amountLabel" ActionTag="1405866311" Tag="276" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="26.0000" Y="27.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="72.2500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.8500" />
                    <PreSize X="0.3611" Y="0.3176" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="selectedTroopOutline" ActionTag="1552645848" Tag="66" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-2.0000" RightMargin="-2.0000" TopMargin="-2.5000" BottomMargin="-2.5000" LeftEage="25" RightEage="25" TopEage="29" BottomEage="29" Scale9OriginX="25" Scale9OriginY="29" Scale9Width="26" Scale9Height="32" ctype="ImageViewObjectData">
                    <Size X="76.0000" Y="90.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="1.0556" Y="1.0588" />
                    <FileData Type="Normal" Path="Art/BattleUI/select_troop.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="823.6800" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8580" Y="0.5000" />
                <PreSize X="0.0750" Y="0.6641" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="slot10" ActionTag="1684004738" Tag="277" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="883.6800" RightMargin="4.3200" TopMargin="21.5000" BottomMargin="21.5000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="72.0000" Y="85.0000" />
                <Children>
                  <AbstractNodeData Name="troopIcon" ActionTag="764741441" Tag="278" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                    <Size X="61.0000" Y="72.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.8472" Y="0.8471" />
                    <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="amountLabel" ActionTag="-1259719785" Tag="280" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="26.0000" Y="27.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="72.2500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.8500" />
                    <PreSize X="0.3611" Y="0.3176" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="selectedTroopOutline" ActionTag="-1392639094" Tag="67" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-2.0000" RightMargin="-2.0000" TopMargin="-2.5000" BottomMargin="-2.5000" LeftEage="25" RightEage="25" TopEage="29" BottomEage="29" Scale9OriginX="25" Scale9OriginY="29" Scale9Width="26" Scale9Height="32" ctype="ImageViewObjectData">
                    <Size X="76.0000" Y="90.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="36.0000" Y="42.5000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="1.0556" Y="1.0588" />
                    <FileData Type="Normal" Path="Art/BattleUI/select_troop.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="919.6800" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9580" Y="0.5000" />
                <PreSize X="0.0750" Y="0.6641" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="480.0000" Y="64.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.1000" />
            <PreSize X="1.0000" Y="0.2000" />
            <FileData Type="Normal" Path="Art/BattleUI/bg_003.png" Plist="" />
            <SingleColor A="255" R="0" G="0" B="0" />
            <FirstColor A="255" R="255" G="150" B="100" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
            <InnerNodeSize Width="960" Height="128" />
          </AbstractNodeData>
          <AbstractNodeData Name="Panel_1" ActionTag="-1652533590" Tag="77" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" RightMargin="760.0000" BottomMargin="440.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" ctype="PanelObjectData">
            <Size X="200.0000" Y="200.0000" />
            <Children>
              <AbstractNodeData Name="dungeonLevelText" ActionTag="-117398622" Tag="288" IconVisible="False" HorizontalEdge="LeftEdge" VerticalEdge="TopEdge" LeftMargin="15.0000" RightMargin="35.0000" TopMargin="5.0000" BottomMargin="160.0000" IsCustomSize="True" FontSize="24" LabelText="Phó bản 1" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="150.0000" Y="35.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="90.0000" Y="177.5000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4500" Y="0.8875" />
                <PreSize X="0.7500" Y="0.1750" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="lootText" ActionTag="-536877265" Tag="289" IconVisible="False" HorizontalEdge="LeftEdge" VerticalEdge="TopEdge" LeftMargin="15.0000" RightMargin="-115.0000" TopMargin="35.0000" BottomMargin="130.0000" IsCustomSize="True" FontSize="20" LabelText="Tài nguyên có thể lấy" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="300.0000" Y="35.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="165.0000" Y="147.5000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8250" Y="0.7375" />
                <PreSize X="1.5000" Y="0.1750" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="goldLootIcon" ActionTag="-940721211" Tag="290" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="17.3400" RightMargin="157.6600" TopMargin="66.8760" BottomMargin="106.1240" LeftEage="6" RightEage="6" TopEage="9" BottomEage="9" Scale9OriginX="6" Scale9OriginY="9" Scale9Width="13" Scale9Height="9" ctype="ImageViewObjectData">
                <Size X="25.0000" Y="27.0000" />
                <AnchorPoint ScaleX="0.5064" ScaleY="0.5880" />
                <Position X="30.0000" Y="122.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1500" Y="0.6100" />
                <PreSize X="0.1250" Y="0.1350" />
                <FileData Type="Normal" Path="Art/BattleUI/tien nho.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="goldLabel" ActionTag="378757880" Tag="292" IconVisible="False" HorizontalEdge="LeftEdge" VerticalEdge="TopEdge" LeftMargin="50.0000" RightMargin="-50.0000" TopMargin="65.0000" BottomMargin="100.0000" IsCustomSize="True" FontSize="20" LabelText="1234567" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="200.0000" Y="35.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="150.0000" Y="117.5000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7500" Y="0.5875" />
                <PreSize X="1.0000" Y="0.1750" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="elixirLootIcon" ActionTag="322641906" Tag="291" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="19.5000" RightMargin="159.5000" TopMargin="94.0000" BottomMargin="78.0000" LeftEage="6" RightEage="6" TopEage="9" BottomEage="9" Scale9OriginX="6" Scale9OriginY="9" Scale9Width="9" Scale9Height="10" ctype="ImageViewObjectData">
                <Size X="21.0000" Y="28.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="30.0000" Y="92.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1500" Y="0.4600" />
                <PreSize X="0.1050" Y="0.1400" />
                <FileData Type="Normal" Path="Art/BattleUI/dau tim.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="elixirLabel" ActionTag="-494280936" Tag="294" IconVisible="False" HorizontalEdge="LeftEdge" VerticalEdge="TopEdge" LeftMargin="50.0000" RightMargin="-50.0000" TopMargin="95.0000" BottomMargin="70.0000" IsCustomSize="True" FontSize="20" LabelText="1234567" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="200.0000" Y="35.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="150.0000" Y="87.5000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7500" Y="0.4375" />
                <PreSize X="1.0000" Y="0.1750" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleY="1.0000" />
            <Position Y="640.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition Y="1.0000" />
            <PreSize X="0.2083" Y="0.3125" />
            <SingleColor A="255" R="150" G="200" B="255" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="resultPanel" ActionTag="1856388044" Tag="69" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="764.9760" RightMargin="15.0240" TopMargin="409.9680" BottomMargin="130.0320" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" Scale9Enable="True" LeftEage="109" RightEage="109" TopEage="20" BottomEage="20" Scale9OriginX="109" Scale9OriginY="20" Scale9Width="113" Scale9Height="21" ctype="PanelObjectData">
            <Size X="180.0000" Y="100.0000" />
            <Children>
              <AbstractNodeData Name="star1" ActionTag="-1563464169" Tag="72" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-17.0000" RightMargin="91.0000" TopMargin="-23.5000" BottomMargin="16.5000" LeftEage="34" RightEage="34" TopEage="35" BottomEage="35" Scale9OriginX="34" Scale9OriginY="35" Scale9Width="38" Scale9Height="37" ctype="ImageViewObjectData">
                <Size X="106.0000" Y="107.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="36.0000" Y="70.0000" />
                <Scale ScaleX="0.4000" ScaleY="0.4000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2000" Y="0.7000" />
                <PreSize X="0.5889" Y="1.0700" />
                <FileData Type="Normal" Path="Art/BattleUI/sao_den.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="star2" ActionTag="930642119" Tag="74" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="37.0000" RightMargin="37.0000" TopMargin="-23.5000" BottomMargin="16.5000" LeftEage="34" RightEage="34" TopEage="35" BottomEage="35" Scale9OriginX="34" Scale9OriginY="35" Scale9Width="38" Scale9Height="37" ctype="ImageViewObjectData">
                <Size X="106.0000" Y="107.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="90.0000" Y="70.0000" />
                <Scale ScaleX="0.4000" ScaleY="0.4000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.7000" />
                <PreSize X="0.5889" Y="1.0700" />
                <FileData Type="Normal" Path="Art/BattleUI/sao_den.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="star3" ActionTag="-1867446676" Tag="75" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="91.0000" RightMargin="-17.0000" TopMargin="-23.5000" BottomMargin="16.5000" LeftEage="34" RightEage="34" TopEage="35" BottomEage="35" Scale9OriginX="34" Scale9OriginY="35" Scale9Width="38" Scale9Height="37" ctype="ImageViewObjectData">
                <Size X="106.0000" Y="107.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="144.0000" Y="70.0000" />
                <Scale ScaleX="0.4000" ScaleY="0.4000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8000" Y="0.7000" />
                <PreSize X="0.5889" Y="1.0700" />
                <FileData Type="Normal" Path="Art/BattleUI/sao_den.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="progressLabel" ActionTag="-119164611" Tag="76" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" TopMargin="57.5000" BottomMargin="17.5000" IsCustomSize="True" FontSize="20" LabelText="0%" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="180.0000" Y="25.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="90.0000" Y="30.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.3000" />
                <PreSize X="1.0000" Y="0.2500" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="854.9760" Y="180.0320" />
            <Scale ScaleX="1.0000" ScaleY="0.9217" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.8906" Y="0.2813" />
            <PreSize X="0.1875" Y="0.1563" />
            <FileData Type="Normal" Path="Art/BattleUI/bg_004.png" Plist="" />
            <SingleColor A="255" R="150" G="200" B="255" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="resourcePanel" ActionTag="-97566252" Tag="295" IconVisible="False" HorizontalEdge="RightEdge" VerticalEdge="TopEdge" LeftMargin="780.0000" BottomMargin="440.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="180.0000" Y="200.0000" />
            <Children>
              <AbstractNodeData Name="goldBackGround" ActionTag="-912415393" Tag="296" IconVisible="False" HorizontalEdge="RightEdge" VerticalEdge="TopEdge" LeftMargin="-59.9993" RightMargin="39.9993" TopMargin="30.0000" BottomMargin="142.0000" Scale9Enable="True" LeftEage="41" RightEage="41" TopEage="11" BottomEage="11" Scale9OriginX="41" Scale9OriginY="11" Scale9Width="45" Scale9Height="6" ctype="ImageViewObjectData">
                <Size X="200.0000" Y="28.0000" />
                <Children>
                  <AbstractNodeData Name="goldFill" ActionTag="344883196" Tag="297" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" LeftMargin="1.0000" RightMargin="7.0000" TopMargin="1.3608" BottomMargin="7.0392" ProgressInfo="100" ProgressType="Right_To_Left" ctype="LoadingBarObjectData">
                    <Size X="192.0000" Y="19.6000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="97.0000" Y="16.8392" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.4850" Y="0.6014" />
                    <PreSize X="0.9600" Y="0.7000" />
                    <ImageFileData Type="Normal" Path="Art/BattleUI/gold_bar.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="goldIcon" ActionTag="-2100801214" Tag="298" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="206.0000" RightMargin="-34.0000" TopMargin="-0.5000" BottomMargin="-0.5000" LeftEage="9" RightEage="9" TopEage="9" BottomEage="9" Scale9OriginX="9" Scale9OriginY="9" Scale9Width="10" Scale9Height="11" ctype="ImageViewObjectData">
                    <Size X="28.0000" Y="29.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="220.0000" Y="14.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="1.1000" Y="0.5000" />
                    <PreSize X="0.1400" Y="1.0357" />
                    <FileData Type="Normal" Path="Art/BattleUI/gold_icon.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="goldCapLabel" ActionTag="-896159708" Tag="305" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" TopMargin="-19.9000" BottomMargin="24.9000" IsCustomSize="True" FontSize="18" LabelText="Tối đa: 16000" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="200.0000" Y="23.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="100.0000" Y="36.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="1.3000" />
                    <PreSize X="1.0000" Y="0.8214" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="playerGoldLabel" ActionTag="529987655" Tag="306" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" LeftMargin="10.0000" RightMargin="10.0000" TopMargin="-1.7000" BottomMargin="6.7000" IsCustomSize="True" FontSize="18" LabelText="16000" HorizontalAlignmentType="HT_Right" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="180.0000" Y="23.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="100.0000" Y="18.2000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.6500" />
                    <PreSize X="0.9000" Y="0.8214" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="40.0007" Y="156.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2222" Y="0.7800" />
                <PreSize X="1.1111" Y="0.1400" />
                <FileData Type="Normal" Path="Art/BattleUI/bg_bar_2.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="elixirBackGround" ActionTag="-259046406" Tag="309" IconVisible="False" HorizontalEdge="RightEdge" VerticalEdge="TopEdge" LeftMargin="-59.9993" RightMargin="39.9993" TopMargin="80.0000" BottomMargin="92.0000" Scale9Enable="True" LeftEage="41" RightEage="41" TopEage="11" BottomEage="11" Scale9OriginX="41" Scale9OriginY="11" Scale9Width="45" Scale9Height="6" ctype="ImageViewObjectData">
                <Size X="200.0000" Y="28.0000" />
                <Children>
                  <AbstractNodeData Name="elixirFill" ActionTag="1319191870" Tag="310" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" LeftMargin="1.0000" RightMargin="7.0000" TopMargin="1.3608" BottomMargin="7.0392" ProgressInfo="100" ProgressType="Right_To_Left" ctype="LoadingBarObjectData">
                    <Size X="192.0000" Y="19.6000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="97.0000" Y="16.8392" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.4850" Y="0.6014" />
                    <PreSize X="0.9600" Y="0.7000" />
                    <ImageFileData Type="Normal" Path="Art/BattleUI/elixir_bar.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="elixirIcon" ActionTag="-1076371395" Tag="311" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="206.5000" RightMargin="-33.5000" TopMargin="-2.0000" BottomMargin="-2.0000" LeftEage="9" RightEage="9" TopEage="9" BottomEage="9" Scale9OriginX="9" Scale9OriginY="9" Scale9Width="9" Scale9Height="14" ctype="ImageViewObjectData">
                    <Size X="27.0000" Y="32.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="220.0000" Y="14.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="1.1000" Y="0.5000" />
                    <PreSize X="0.1350" Y="1.1429" />
                    <FileData Type="Normal" Path="Art/BattleUI/elixir_icon.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="elixirCapLabel" ActionTag="659259314" Tag="312" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" TopMargin="-19.9000" BottomMargin="24.9000" IsCustomSize="True" FontSize="18" LabelText="Tối đa: 16000" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="200.0000" Y="23.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="100.0000" Y="36.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="1.3000" />
                    <PreSize X="1.0000" Y="0.8214" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="playerElixirLabel" ActionTag="-1452121864" Tag="313" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" LeftMargin="10.0000" RightMargin="10.0000" TopMargin="-1.7000" BottomMargin="6.7000" IsCustomSize="True" FontSize="18" LabelText="16000" HorizontalAlignmentType="HT_Right" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="180.0000" Y="23.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="100.0000" Y="18.2000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.6500" />
                    <PreSize X="0.9000" Y="0.8214" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="40.0007" Y="106.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2222" Y="0.5300" />
                <PreSize X="1.1111" Y="0.1400" />
                <FileData Type="Normal" Path="Art/BattleUI/bg_bar_2.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="gemBackGround" ActionTag="1140535145" Tag="314" IconVisible="False" HorizontalEdge="RightEdge" VerticalEdge="TopEdge" LeftMargin="-59.9993" RightMargin="39.9993" TopMargin="130.0000" BottomMargin="42.0000" Scale9Enable="True" LeftEage="41" RightEage="41" TopEage="11" BottomEage="11" Scale9OriginX="41" Scale9OriginY="11" Scale9Width="45" Scale9Height="6" ctype="ImageViewObjectData">
                <Size X="200.0000" Y="28.0000" />
                <Children>
                  <AbstractNodeData Name="gemFill" ActionTag="-219539056" Tag="315" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" LeftMargin="1.0000" RightMargin="7.0000" TopMargin="1.3608" BottomMargin="7.0392" ProgressInfo="100" ProgressType="Right_To_Left" ctype="LoadingBarObjectData">
                    <Size X="192.0000" Y="19.6000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="97.0000" Y="16.8392" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.4850" Y="0.6014" />
                    <PreSize X="0.9600" Y="0.7000" />
                    <ImageFileData Type="Normal" Path="Art/BattleUI/g_bar.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="gemIcon" ActionTag="2117920433" Tag="316" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="206.5000" RightMargin="-33.5000" LeftEage="9" RightEage="9" TopEage="9" BottomEage="9" Scale9OriginX="9" Scale9OriginY="9" Scale9Width="9" Scale9Height="10" ctype="ImageViewObjectData">
                    <Size X="27.0000" Y="28.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="220.0000" Y="14.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="1.1000" Y="0.5000" />
                    <PreSize X="0.1350" Y="1.0000" />
                    <FileData Type="Normal" Path="Art/BattleUI/g_icon.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="gemCapLabel" ActionTag="1378593581" Tag="317" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" TopMargin="-19.9000" BottomMargin="24.9000" IsCustomSize="True" FontSize="18" LabelText="Tối đa: 16000" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="200.0000" Y="23.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="100.0000" Y="36.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="1.3000" />
                    <PreSize X="1.0000" Y="0.8214" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="playerGemLabel" ActionTag="-860141134" Tag="318" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" LeftMargin="10.0000" RightMargin="10.0000" TopMargin="-1.7000" BottomMargin="6.7000" IsCustomSize="True" FontSize="18" LabelText="16000" HorizontalAlignmentType="HT_Right" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="180.0000" Y="23.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="100.0000" Y="18.2000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.6500" />
                    <PreSize X="0.9000" Y="0.8214" />
                    <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                    <OutlineColor A="255" R="0" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="40.0007" Y="56.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2222" Y="0.2800" />
                <PreSize X="1.1111" Y="0.1400" />
                <FileData Type="Normal" Path="Art/BattleUI/bg_bar_2.png" Plist="" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="870.0000" Y="540.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9063" Y="0.8438" />
            <PreSize X="0.1875" Y="0.3125" />
            <SingleColor A="255" R="150" G="200" B="255" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="timerLabel" ActionTag="81542051" Tag="85" IconVisible="False" PositionPercentXEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" VerticalEdge="TopEdge" TopMargin="-5.0000" BottomMargin="595.0000" IsCustomSize="True" FontSize="24" LabelText="Thời gian còn lại: 1m30s" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="960.0000" Y="50.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="480.0000" Y="620.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.9688" />
            <PreSize X="1.0000" Y="0.0781" />
            <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
            <OutlineColor A="255" R="0" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="findNextButton" ActionTag="-863239179" Tag="201" IconVisible="False" HorizontalEdge="RightEdge" VerticalEdge="BottomEdge" LeftMargin="780.0000" RightMargin="15.0000" TopMargin="431.0000" BottomMargin="130.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="135" Scale9Height="57" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="165.0000" Y="79.0000" />
            <Children>
              <AbstractNodeData Name="findNextText" ActionTag="-1996871642" Tag="202" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" LeftMargin="-16.1865" RightMargin="16.1865" TopMargin="8.6784" BottomMargin="38.3216" IsCustomSize="True" FontSize="24" LabelText="Tìm tiếp" HorizontalAlignmentType="HT_Right" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="165.0000" Y="32.0000" />
                <AnchorPoint ScaleX="0.5481" ScaleY="0.2837" />
                <Position X="74.2500" Y="47.4000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4500" Y="0.6000" />
                <PreSize X="1.0000" Y="0.4051" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="goldNextIcon" ActionTag="1878751758" Tag="204" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="118.0000" RightMargin="19.0000" TopMargin="39.2200" BottomMargin="10.7800" LeftEage="9" RightEage="9" TopEage="9" BottomEage="9" Scale9OriginX="9" Scale9OriginY="9" Scale9Width="10" Scale9Height="11" ctype="ImageViewObjectData">
                <Size X="28.0000" Y="29.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="132.0000" Y="25.2800" />
                <Scale ScaleX="0.8000" ScaleY="0.8000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8000" Y="0.3200" />
                <PreSize X="0.1697" Y="0.3671" />
                <FileData Type="Normal" Path="Art/BattleUI/gold_icon.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="costLabel" ActionTag="-839074629" Tag="203" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="86.0000" RightMargin="53.0000" TopMargin="40.2200" BottomMargin="11.7800" FontSize="20" LabelText="50" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="26.0000" Y="27.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="99.0000" Y="25.2800" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.6000" Y="0.3200" />
                <PreSize X="0.1576" Y="0.3418" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="862.5000" Y="169.5000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.8984" Y="0.2648" />
            <PreSize X="0.1719" Y="0.1234" />
            <TextColor A="255" R="65" G="65" B="70" />
            <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
            <PressedFileData Type="Normal" Path="Art/BattleUI/button_next_find.png" Plist="" />
            <NormalFileData Type="Normal" Path="Art/BattleUI/button_next_find.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>