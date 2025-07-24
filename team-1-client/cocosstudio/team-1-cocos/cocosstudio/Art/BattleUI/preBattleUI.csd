<GameFile>
  <PropertyGroup Name="preBattleUI" Type="Scene" ID="d2c8e9a9-2106-417d-a9e5-e74b84ff07d0" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Scene" ctype="GameNodeObjectData">
        <Size X="960.0000" Y="640.0000" />
        <Children>
          <AbstractNodeData Name="topPanel" ActionTag="-376352535" Tag="4" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" BottomMargin="384.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="63" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="960.0000" Y="256.0000" />
            <Children>
              <AbstractNodeData Name="troopToFight" ActionTag="-2036076902" Tag="5" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentHeightEnable="True" PercentHeightEnabled="True" LeftMargin="0.5000" RightMargin="384.5000" TopMargin="89.6000" BottomMargin="38.4000" TouchEnable="True" ClipAble="True" BackColorAlpha="179" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Enable="True" LeftEage="132" RightEage="86" TopEage="36" BottomEage="36" Scale9OriginX="132" Scale9OriginY="36" Scale9Width="45" Scale9Height="38" IsBounceEnabled="True" ScrollDirectionType="Horizontal" ctype="ScrollViewObjectData">
                <Size X="575.0000" Y="128.0000" />
                <Children>
                  <AbstractNodeData Name="slot1" ActionTag="655710989" Tag="7" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="15.0400" RightMargin="792.9600" TopMargin="15.1000" BottomMargin="27.9000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="-995513450" Tag="53" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="deductButton" ActionTag="1271823116" Tag="54" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-16.4000" RightMargin="48.4000" TopMargin="-15.7500" BottomMargin="60.7500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="10" Scale9Height="18" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                        <Size X="40.0000" Y="40.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="3.6000" Y="80.7500" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.0500" Y="0.9500" />
                        <PreSize X="0.5556" Y="0.4706" />
                        <TextColor A="255" R="65" G="65" B="70" />
                        <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                        <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                        <NormalFileData Type="Normal" Path="Art/BattleUI/cancel.png" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="512420104" Tag="55" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0028" RightMargin="22.9972" TopMargin="-0.7545" BottomMargin="58.7545" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                        <Size X="26.0000" Y="27.0000" />
                        <AnchorPoint ScaleX="0.6486" ScaleY="0.1740" />
                        <Position X="39.8664" Y="63.4525" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5537" Y="0.7465" />
                        <PreSize X="0.3611" Y="0.3176" />
                        <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                        <OutlineColor A="255" R="0" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="51.0400" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.0580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6641" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot2" ActionTag="1550967901" Tag="60" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="103.0400" RightMargin="704.9600" TopMargin="15.1000" BottomMargin="27.9000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="-431535892" Tag="61" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="deductButton" ActionTag="-536670099" Tag="62" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-16.4000" RightMargin="48.4000" TopMargin="-15.7500" BottomMargin="60.7500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="10" Scale9Height="18" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                        <Size X="40.0000" Y="40.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="3.6000" Y="80.7500" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.0500" Y="0.9500" />
                        <PreSize X="0.5556" Y="0.4706" />
                        <TextColor A="255" R="65" G="65" B="70" />
                        <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                        <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                        <NormalFileData Type="Normal" Path="Art/BattleUI/cancel.png" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="-2075648525" Tag="63" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="139.0400" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.1580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6641" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot3" ActionTag="896345505" Tag="64" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="191.0400" RightMargin="616.9600" TopMargin="15.1000" BottomMargin="27.9000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="1449849083" Tag="65" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="deductButton" ActionTag="-897351828" Tag="66" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-16.4000" RightMargin="48.4000" TopMargin="-15.7500" BottomMargin="60.7500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="10" Scale9Height="18" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                        <Size X="40.0000" Y="40.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="3.6000" Y="80.7500" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.0500" Y="0.9500" />
                        <PreSize X="0.5556" Y="0.4706" />
                        <TextColor A="255" R="65" G="65" B="70" />
                        <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                        <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                        <NormalFileData Type="Normal" Path="Art/BattleUI/cancel.png" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="1191051721" Tag="67" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="227.0400" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.2580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6641" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot4" ActionTag="-33449882" Tag="68" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="279.0400" RightMargin="528.9600" TopMargin="15.1000" BottomMargin="27.9000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="-125589035" Tag="69" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="deductButton" ActionTag="1969619606" Tag="70" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-16.4000" RightMargin="48.4000" TopMargin="-15.7500" BottomMargin="60.7500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="10" Scale9Height="18" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                        <Size X="40.0000" Y="40.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="3.6000" Y="80.7500" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.0500" Y="0.9500" />
                        <PreSize X="0.5556" Y="0.4706" />
                        <TextColor A="255" R="65" G="65" B="70" />
                        <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                        <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                        <NormalFileData Type="Normal" Path="Art/BattleUI/cancel.png" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="-1117311762" Tag="71" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="315.0400" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.3580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6641" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot5" ActionTag="-1980698972" Tag="72" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="367.0400" RightMargin="440.9600" TopMargin="15.1000" BottomMargin="27.9000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="-18529308" Tag="73" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="deductButton" ActionTag="-279126304" Tag="74" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-16.4000" RightMargin="48.4000" TopMargin="-15.7500" BottomMargin="60.7500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="10" Scale9Height="18" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                        <Size X="40.0000" Y="40.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="3.6000" Y="80.7500" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.0500" Y="0.9500" />
                        <PreSize X="0.5556" Y="0.4706" />
                        <TextColor A="255" R="65" G="65" B="70" />
                        <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                        <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                        <NormalFileData Type="Normal" Path="Art/BattleUI/cancel.png" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="-99622370" Tag="75" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="403.0400" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.4580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6641" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot6" ActionTag="-223825045" Tag="76" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="455.0400" RightMargin="352.9600" TopMargin="15.1000" BottomMargin="27.9000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="-425942470" Tag="77" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="deductButton" ActionTag="-38331503" Tag="78" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-16.4000" RightMargin="48.4000" TopMargin="-15.7500" BottomMargin="60.7500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="10" Scale9Height="18" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                        <Size X="40.0000" Y="40.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="3.6000" Y="80.7500" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.0500" Y="0.9500" />
                        <PreSize X="0.5556" Y="0.4706" />
                        <TextColor A="255" R="65" G="65" B="70" />
                        <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                        <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                        <NormalFileData Type="Normal" Path="Art/BattleUI/cancel.png" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="-321883227" Tag="79" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="491.0400" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6641" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot7" ActionTag="697595172" Tag="80" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="543.0400" RightMargin="264.9600" TopMargin="15.1000" BottomMargin="27.9000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="753175254" Tag="81" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="deductButton" ActionTag="-1892650594" Tag="82" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-16.4000" RightMargin="48.4000" TopMargin="-15.7500" BottomMargin="60.7500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="10" Scale9Height="18" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                        <Size X="40.0000" Y="40.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="3.6000" Y="80.7500" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.0500" Y="0.9500" />
                        <PreSize X="0.5556" Y="0.4706" />
                        <TextColor A="255" R="65" G="65" B="70" />
                        <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                        <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                        <NormalFileData Type="Normal" Path="Art/BattleUI/cancel.png" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="1837999557" Tag="83" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="579.0400" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.6580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6641" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot8" ActionTag="-2030402575" Tag="84" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="631.0400" RightMargin="176.9600" TopMargin="15.1000" BottomMargin="27.9000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="401340340" Tag="85" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="deductButton" ActionTag="-810525553" Tag="86" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-16.4000" RightMargin="48.4000" TopMargin="-15.7500" BottomMargin="60.7500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="10" Scale9Height="18" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                        <Size X="40.0000" Y="40.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="3.6000" Y="80.7500" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.0500" Y="0.9500" />
                        <PreSize X="0.5556" Y="0.4706" />
                        <TextColor A="255" R="65" G="65" B="70" />
                        <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                        <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                        <NormalFileData Type="Normal" Path="Art/BattleUI/cancel.png" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="-1847022054" Tag="87" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="667.0400" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.7580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6641" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot9" ActionTag="-642747440" Tag="88" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="719.0400" RightMargin="88.9600" TopMargin="15.1000" BottomMargin="27.9000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="92337279" Tag="89" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="deductButton" ActionTag="896119749" Tag="90" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-16.4000" RightMargin="48.4000" TopMargin="-15.7500" BottomMargin="60.7500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="10" Scale9Height="18" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                        <Size X="40.0000" Y="40.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="3.6000" Y="80.7500" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.0500" Y="0.9500" />
                        <PreSize X="0.5556" Y="0.4706" />
                        <TextColor A="255" R="65" G="65" B="70" />
                        <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                        <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                        <NormalFileData Type="Normal" Path="Art/BattleUI/cancel.png" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="1793772532" Tag="91" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="755.0400" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.8580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6641" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot10" ActionTag="1203798277" Tag="92" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="807.0400" RightMargin="0.9600" TopMargin="15.1000" BottomMargin="27.9000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="-1449720897" Tag="93" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="deductButton" ActionTag="-922154532" Tag="94" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-16.4000" RightMargin="48.4000" TopMargin="-15.7500" BottomMargin="60.7500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="10" Scale9Height="18" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                        <Size X="40.0000" Y="40.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="3.6000" Y="80.7500" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.0500" Y="0.9500" />
                        <PreSize X="0.5556" Y="0.4706" />
                        <TextColor A="255" R="65" G="65" B="70" />
                        <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                        <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                        <NormalFileData Type="Normal" Path="Art/BattleUI/cancel.png" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="178438649" Tag="95" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="843.0400" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.9580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6641" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="288.0000" Y="102.4000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3000" Y="0.4000" />
                <PreSize X="0.5990" Y="0.5000" />
                <FileData Type="Normal" Path="Art/BattleUI/bg_003.png" Plist="" />
                <SingleColor A="255" R="0" G="0" B="0" />
                <FirstColor A="255" R="255" G="150" B="100" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
                <InnerNodeSize Width="880" Height="128" />
              </AbstractNodeData>
              <AbstractNodeData Name="troopCapLabel" ActionTag="-875782003" Tag="17" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="15.2000" RightMargin="744.8000" TopMargin="191.3000" BottomMargin="37.7000" IsCustomSize="True" FontSize="20" LabelText="Lính: 0/30" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="200.0000" Y="27.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="115.2000" Y="51.2000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1200" Y="0.2000" />
                <PreSize X="0.2083" Y="0.1055" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="spellToFight" ActionTag="-1790389206" Tag="18" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" LeftMargin="624.0000" RightMargin="48.0000" TopMargin="89.6000" BottomMargin="38.4000" TouchEnable="True" ClipAble="True" BackColorAlpha="179" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Enable="True" LeftEage="9" RightEage="86" TopEage="36" BottomEage="36" Scale9OriginX="9" Scale9OriginY="36" Scale9Width="168" Scale9Height="38" IsBounceEnabled="True" ScrollDirectionType="Horizontal" ctype="ScrollViewObjectData">
                <Size X="288.0000" Y="128.0000" />
                <Children>
                  <AbstractNodeData Name="slot1" ActionTag="-943396173" Tag="19" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="8.5050" RightMargin="271.4950" TopMargin="15.6000" BottomMargin="28.4000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="40" Scale9Height="62" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="70.0000" Y="84.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="43.5050" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.1243" Y="0.5500" />
                    <PreSize X="0.2000" Y="0.6563" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_0010.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot2" ActionTag="1074637879" Tag="20" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="96.0050" RightMargin="183.9950" TopMargin="15.6000" BottomMargin="28.4000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="40" Scale9Height="62" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="70.0000" Y="84.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="131.0050" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.3743" Y="0.5500" />
                    <PreSize X="0.2000" Y="0.6563" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_0010.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot3" ActionTag="-94252259" Tag="21" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="183.5050" RightMargin="96.4950" TopMargin="15.6000" BottomMargin="28.4000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="40" Scale9Height="62" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="70.0000" Y="84.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="218.5050" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.6243" Y="0.5500" />
                    <PreSize X="0.2000" Y="0.6563" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_0010.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot4" ActionTag="1188427450" Tag="22" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="271.0050" RightMargin="8.9950" TopMargin="15.6000" BottomMargin="28.4000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="40" Scale9Height="62" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="70.0000" Y="84.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="306.0050" Y="70.4000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.8743" Y="0.5500" />
                    <PreSize X="0.2000" Y="0.6563" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_0010.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="768.0000" Y="102.4000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8000" Y="0.4000" />
                <PreSize X="0.3000" Y="0.5000" />
                <FileData Type="Normal" Path="Art/BattleUI/bg_003.png" Plist="" />
                <SingleColor A="255" R="0" G="0" B="0" />
                <FirstColor A="255" R="255" G="150" B="100" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
                <InnerNodeSize Width="350" Height="128" />
              </AbstractNodeData>
              <AbstractNodeData Name="spellCapLabel" ActionTag="-718263368" Tag="29" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="631.0080" RightMargin="128.9920" TopMargin="190.4552" BottomMargin="38.5448" IsCustomSize="True" FontSize="20" LabelText="Bình phép: 0/0" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="200.0000" Y="27.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="631.0080" Y="52.0448" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.6573" Y="0.2033" />
                <PreSize X="0.2083" Y="0.1055" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="480.0000" Y="512.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.8000" />
            <PreSize X="1.0000" Y="0.4000" />
            <SingleColor A="255" R="0" G="0" B="0" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="botPanel" ActionTag="859019896" Tag="41" IconVisible="False" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" TopMargin="512.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="960.0000" Y="128.0000" />
            <Children>
              <AbstractNodeData Name="troopFromArmy" ActionTag="1476550655" Tag="96" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentHeightEnable="True" PercentHeightEnabled="True" LeftMargin="0.5000" RightMargin="384.5000" TopMargin="12.8000" BottomMargin="12.8000" TouchEnable="True" ClipAble="True" BackColorAlpha="179" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Enable="True" LeftEage="132" RightEage="86" TopEage="36" BottomEage="36" Scale9OriginX="-86" Scale9OriginY="-36" Scale9Width="218" Scale9Height="72" IsBounceEnabled="True" ScrollDirectionType="Horizontal" ctype="ScrollViewObjectData">
                <Size X="575.0000" Y="102.4000" />
                <Children>
                  <AbstractNodeData Name="slot1" ActionTag="-1596192472" Tag="97" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="15.0400" RightMargin="792.9600" TopMargin="14.6500" BottomMargin="27.3500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="-1128385637" Tag="98" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="620958064" Tag="100" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="51.0400" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.0580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6693" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot2" ActionTag="-1268446864" Tag="101" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="103.0400" RightMargin="704.9600" TopMargin="14.6500" BottomMargin="27.3500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="-15810765" Tag="102" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="-548402217" Tag="104" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="139.0400" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.1580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6693" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot3" ActionTag="-1032801812" Tag="105" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="191.0400" RightMargin="616.9600" TopMargin="14.6500" BottomMargin="27.3500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="1098117107" Tag="106" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="-705534907" Tag="108" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="227.0400" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.2580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6693" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot4" ActionTag="1012569061" Tag="109" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="279.0400" RightMargin="528.9600" TopMargin="14.6500" BottomMargin="27.3500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="1740307801" Tag="110" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="-1184207097" Tag="112" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="315.0400" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.3580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6693" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot5" ActionTag="685563357" Tag="113" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="367.0400" RightMargin="440.9600" TopMargin="14.6500" BottomMargin="27.3500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="623663107" Tag="114" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="1581130419" Tag="116" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="403.0400" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.4580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6693" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot6" ActionTag="-1187845369" Tag="117" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="455.0400" RightMargin="352.9600" TopMargin="14.6500" BottomMargin="27.3500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="1178930361" Tag="118" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="1324666042" Tag="120" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="491.0400" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6693" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot7" ActionTag="-1332537861" Tag="121" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="543.0400" RightMargin="264.9600" TopMargin="14.6500" BottomMargin="27.3500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="-456306488" Tag="122" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="1452578484" Tag="124" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="579.0400" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.6580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6693" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot8" ActionTag="-1074229527" Tag="125" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="631.0400" RightMargin="176.9600" TopMargin="14.6500" BottomMargin="27.3500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="-1359575795" Tag="126" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="-1660146991" Tag="128" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="667.0400" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.7580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6693" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot9" ActionTag="1384910500" Tag="129" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="719.0400" RightMargin="88.9600" TopMargin="14.6500" BottomMargin="27.3500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="-120925417" Tag="130" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="905127621" Tag="132" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="755.0400" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.8580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6693" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot10" ActionTag="-1588771229" Tag="133" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="807.0400" RightMargin="0.9600" TopMargin="14.6500" BottomMargin="27.3500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="63" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="72.0000" Y="85.0000" />
                    <Children>
                      <AbstractNodeData Name="troopIcon" ActionTag="952708149" Tag="134" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="5.5000" RightMargin="5.5000" TopMargin="6.5000" BottomMargin="6.5000" LeftEage="20" RightEage="20" TopEage="23" BottomEage="23" Scale9OriginX="20" Scale9OriginY="23" Scale9Width="21" Scale9Height="26" ctype="ImageViewObjectData">
                        <Size X="61.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="36.0000" Y="42.5000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.8472" Y="0.8471" />
                        <FileData Type="Normal" Path="Art/BattleUI/ARM_1_Battle.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="amountLabel" ActionTag="-1605335190" Tag="136" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="23.0000" RightMargin="23.0000" TopMargin="-0.7500" BottomMargin="58.7500" FontSize="20" LabelText="x2" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="843.0400" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.9580" Y="0.5500" />
                    <PreSize X="0.0818" Y="0.6693" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_009.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="288.0000" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3000" Y="0.5000" />
                <PreSize X="0.5990" Y="0.8000" />
                <SingleColor A="255" R="0" G="0" B="0" />
                <FirstColor A="255" R="255" G="150" B="100" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
                <InnerNodeSize Width="880" Height="127" />
              </AbstractNodeData>
              <AbstractNodeData Name="spellFromArmy" ActionTag="1912428954" Tag="183" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" LeftMargin="624.0000" RightMargin="48.0000" TopMargin="12.8000" BottomMargin="12.8000" TouchEnable="True" ClipAble="True" BackColorAlpha="179" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Enable="True" LeftEage="9" RightEage="86" TopEage="36" BottomEage="36" Scale9OriginX="-86" Scale9OriginY="-36" Scale9Width="95" Scale9Height="72" IsBounceEnabled="True" ScrollDirectionType="Horizontal" ctype="ScrollViewObjectData">
                <Size X="288.0000" Y="102.4000" />
                <Children>
                  <AbstractNodeData Name="slot1" ActionTag="484840182" Tag="184" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="8.5050" RightMargin="271.4950" TopMargin="15.1500" BottomMargin="27.8500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="40" Scale9Height="62" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="70.0000" Y="84.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="43.5050" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.1243" Y="0.5500" />
                    <PreSize X="0.2000" Y="0.6614" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_0010.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot2" ActionTag="-186371994" Tag="185" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="96.0050" RightMargin="183.9950" TopMargin="15.1500" BottomMargin="27.8500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="40" Scale9Height="62" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="70.0000" Y="84.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="131.0050" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.3743" Y="0.5500" />
                    <PreSize X="0.2000" Y="0.6614" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_0010.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot3" ActionTag="-738623686" Tag="186" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="183.5050" RightMargin="96.4950" TopMargin="15.1500" BottomMargin="27.8500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="40" Scale9Height="62" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="70.0000" Y="84.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="218.5050" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.6243" Y="0.5500" />
                    <PreSize X="0.2000" Y="0.6614" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_0010.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="slot4" ActionTag="501781417" Tag="187" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="271.0050" RightMargin="8.9950" TopMargin="15.1500" BottomMargin="27.8500" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="40" Scale9Height="62" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="70.0000" Y="84.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="306.0050" Y="69.8500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.8743" Y="0.5500" />
                    <PreSize X="0.2000" Y="0.6614" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="Art/BattleUI/bg_0010.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="768.0000" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8000" Y="0.5000" />
                <PreSize X="0.3000" Y="0.8000" />
                <SingleColor A="255" R="0" G="0" B="0" />
                <FirstColor A="255" R="255" G="150" B="100" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
                <InnerNodeSize Width="350" Height="127" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="1.0000" Y="0.2000" />
            <SingleColor A="255" R="150" G="200" B="255" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="topDevelopingText" ActionTag="1772374055" Tag="189" IconVisible="False" LeftMargin="648.0938" RightMargin="61.9062" TopMargin="124.3056" BottomMargin="488.6944" IsCustomSize="True" FontSize="20" LabelText="Tính năng đang phát triển" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="250.0000" Y="27.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="773.0938" Y="502.1944" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.8053" Y="0.7847" />
            <PreSize X="0.2604" Y="0.0422" />
            <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="botDevelopingText" ActionTag="52712284" Tag="188" IconVisible="False" LeftMargin="643.8046" RightMargin="66.1954" TopMargin="564.0573" BottomMargin="48.9427" IsCustomSize="True" FontSize="20" LabelText="Tính năng đang phát triển" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="250.0000" Y="27.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="768.8046" Y="62.4427" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.8008" Y="0.0976" />
            <PreSize X="0.2604" Y="0.0422" />
            <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="sceneText" ActionTag="1404669796" Tag="3" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" TopMargin="39.0000" BottomMargin="551.0000" IsCustomSize="True" FontSize="30" LabelText="LỰA CHỌN QUÂN ĐỘI - THAM GIA CHIẾN ĐẤU" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="960.0000" Y="50.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="480.0000" Y="576.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.9000" />
            <PreSize X="1.0000" Y="0.0781" />
            <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="homeButton" ActionTag="-905917980" Tag="190" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="220.0000" RightMargin="604.0000" TopMargin="451.0000" BottomMargin="131.0000" TouchEnable="True" FontSize="22" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="106" Scale9Height="36" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="136.0000" Y="58.0000" />
            <Children>
              <AbstractNodeData Name="homeText" ActionTag="1173970144" Tag="192" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" TopMargin="13.0000" BottomMargin="13.0000" IsCustomSize="True" FontSize="24" LabelText="Về nhà" HorizontalAlignmentType="HT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="136.0000" Y="32.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="68.0000" Y="29.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.5000" />
                <PreSize X="1.0000" Y="0.5517" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="288.0000" Y="160.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.3000" Y="0.2500" />
            <PreSize X="0.1417" Y="0.0906" />
            <FontResource Type="Default" Path="" Plist="" />
            <TextColor A="255" R="255" G="255" B="255" />
            <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
            <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
            <NormalFileData Type="Normal" Path="Art/BattleUI/bt_002.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="fightButton" ActionTag="-945381585" Tag="191" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="604.0000" RightMargin="220.0000" TopMargin="451.0000" BottomMargin="131.0000" TouchEnable="True" FontSize="22" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="106" Scale9Height="36" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="136.0000" Y="58.0000" />
            <Children>
              <AbstractNodeData Name="fightText" ActionTag="-1464123118" Tag="193" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-7.0000" RightMargin="-7.0000" TopMargin="13.0000" BottomMargin="13.0000" IsCustomSize="True" FontSize="24" LabelText="Chiến đấu" HorizontalAlignmentType="HT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="150.0000" Y="32.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="68.0000" Y="29.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.5000" />
                <PreSize X="1.1029" Y="0.5517" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="672.0000" Y="160.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.7000" Y="0.2500" />
            <PreSize X="0.1417" Y="0.0906" />
            <FontResource Type="Default" Path="" Plist="" />
            <TextColor A="255" R="255" G="255" B="255" />
            <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
            <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
            <NormalFileData Type="Normal" Path="Art/BattleUI/bt_003.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="suggestTroopButton" ActionTag="-809183801" Tag="181" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="412.0000" RightMargin="412.0000" TopMargin="441.4000" BottomMargin="140.6000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="106" Scale9Height="36" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="136.0000" Y="58.0000" />
            <Children>
              <AbstractNodeData Name="suggestTroopLabel" ActionTag="-1568054303" Tag="182" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-2.0000" RightMargin="-2.0000" TopMargin="17.5000" BottomMargin="17.5000" IsCustomSize="True" FontSize="18" LabelText="Gợi ý đội hình" HorizontalAlignmentType="HT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="140.0000" Y="23.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="68.0000" Y="29.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.5000" />
                <PreSize X="1.0294" Y="0.3966" />
                <FontResource Type="Normal" Path="Art/Fonts/Rowdies-Regular_29-07.ttf" Plist="" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="480.0000" Y="169.6000" />
            <Scale ScaleX="1.4400" ScaleY="1.4400" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.2650" />
            <PreSize X="0.1417" Y="0.0906" />
            <TextColor A="255" R="65" G="65" B="70" />
            <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
            <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
            <NormalFileData Type="Normal" Path="Art/BattleUI/bt_003.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>