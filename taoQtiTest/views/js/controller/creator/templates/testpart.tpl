<div id="{{identifier}}" class="testpart clearfix">

   <h1><span data-bind="identifier">{{identifier}}</span>
        <div class="actions">
            <div class="tlb">
                <div class="tlb-top">
                    <span class="tlb-box">
                        <span class="tlb-bar">
                            <span class="tlb-start"></span>
                            <span class="tlb-group">
                                <a href="#" class="tlb-button-off property-toggler" title="{{__ 'Test Part Properties'}}"><span class="icon-settings"></span></a>
                                <span class="tlb-separator"></span>
                                <a href="#" class="tlb-button-off move-up" title="{{__ 'Move Up'}}"><span class="icon-up"></span></a>
                                <a href="#" class="tlb-button-off move-down" title="{{__ 'Move Down'}}"><span class="icon-down"></span></a>
                                <span class="tlb-separator"></span>
                                <a href="#" class="tlb-button-off" title="{{__ 'Remove Test Part'}}" data-delete="#{{identifier}}"><span class="icon-bin"></span></a>
                            </span>
                            <span class="tlb-end"></span>
                        </span>
                    </span>
                </div>
            </div>
        </div>
        <a href="#" class="toggler opened" data-toggle="#testpart-content-{{identifier}}"></a>
    </h1>
    <div id="testpart-content-{{identifier}}" class="testpart-content">

       <!-- assessmentTest/testPart/assessmentSections -->
       <div class="sections" data-bind-each="assessmentSections" data-bind-tmpl="section" data-bind-filter="isSection"></div>

        <button class="btn-info small section-adder">
            <span class="icon-add"></span>
            {{__ 'New section'}}
        </button>
    </div>
</div>
